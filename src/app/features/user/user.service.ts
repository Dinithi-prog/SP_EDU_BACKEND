import {UserRoleEntity} from './entity/user-role.entity';
import {BadRequestException, ConflictException, Injectable, NotFoundException} from '@nestjs/common';
import {CreateUserDto} from './dto/create-user.dto';
import {UpdateUserDto} from './dto/update-user.dto';
import {UserRepository} from './repository/user.repository';
import {SchemaConstants} from '@core/constants/schema-constants';
import {UtilService} from '@shared/services/util.service';
import {UniqueIdConstants} from '@core/constants/unique-id-constants';
import {CreateRoleDto} from './dto/create-role.dto';
import {PasswordService} from '@shared/services/password.service';
import {UserLoginDto} from './dto/login-user.dto';
import {JwtService} from '@shared/services/jwt-service.service';

interface SignInParams {
  email: string;
  password: string;
}

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly utilService: UtilService,
    private readonly passwordService: PasswordService,
    private readonly jwtService: JwtService,
  ) {}

  async createUser(createUserDto: CreateUserDto) {
    // Generate a unique user ID
    const userId = this.utilService.generateUniqueId(UniqueIdConstants.USER);
    createUserDto.userId = userId;

    // Set the creation and update timestamps
    createUserDto.createAt = new Date();
    createUserDto.updatedAt = new Date();
    createUserDto.status = 'Active';

    // Extract the year from the dob
    const dobYear = new Date(createUserDto.dob).getFullYear();

    // Generate the password using firstName and dob year
    const generatedPassword = `${createUserDto.firstName}${dobYear}`;

    const hashedPassword = await this.passwordService.hashPassword(generatedPassword);

    createUserDto.password = hashedPassword;

    // Check for duplicate email
    await this.duplicateOrThrow(SchemaConstants.USER, {email: createUserDto.email});

    // Check for duplicate mobile number
    await this.duplicateOrThrow(SchemaConstants.USER, {mobileNumber: createUserDto.mobileNumber});

    // Check for duplicate alternative number if it exists
    createUserDto.alternativeNumber
      ? await this.duplicateOrThrow(SchemaConstants.USER, {alternativeNumber: createUserDto.alternativeNumber})
      : null;

    // Create the user in the repository
    return this.userRepository.createUser(SchemaConstants.USER, createUserDto);
  }

  async loginUser({email, password}: SignInParams) {
    const registeredUser = await this.getUserOrThrow({email: email});

    const hashPassword = registeredUser?.password;

    const isValidPassword = await this.passwordService.comparePasswords(password, hashPassword);

    if (!isValidPassword) {
      throw new BadRequestException('Invalid password: The password is incorrect.');
    }

    const payload = {
      userId: registeredUser.userId,
      userName: registeredUser.firstName + ' ' + registeredUser.lastName,
      userRole: registeredUser.userRole,
    };

    const token = this.jwtService.generateJWT(payload);

    return {
      userId: registeredUser.userId,
      userName: registeredUser.firstName + ' ' + registeredUser.firstName,
      userRole: registeredUser.userRole,
      token: token,
    };
  }

  async createUserRole(createRoleDto: CreateRoleDto) {
    // Generate a unique role ID
    const roleId = this.utilService.generateUniqueId(UniqueIdConstants.ROLE);
    createRoleDto.roleId = roleId;

    // Set the creation and update timestamps
    createRoleDto.createdAt = new Date();
    createRoleDto.updatedAt = new Date();

    // Check for duplicate role name
    await this.duplicateOrThrow(SchemaConstants.ROLE, {roleName: createRoleDto.roleName});

    // Create the role in the repository
    return this.userRepository.createRole(SchemaConstants.ROLE, createRoleDto);
  }

  findAllUser() {
    // Return all users by calling the getUsers method from userRepository with an empty filter
    return this.userRepository.getUsers(SchemaConstants.USER, {});
  }

  findAllUserRole() {
    // Return all users roles by calling the getRoles method from userRepository with an empty filter
    return this.userRepository.getRoles(SchemaConstants.ROLE, {});
  }

  findOneUser(id: string) {
    // Retrieve a user by their userId from the user repository
    return this.userRepository.getUser(SchemaConstants.USER, {userId: id});
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto) {
    // Ensure the user exists by checking the userId
    await this.getUserOrThrow({userId: id});

    // Set the update timestamp
    updateUserDto.updatedAt = new Date();

    // Update the user in the repository with the new data
    this.userRepository.updateUser(SchemaConstants.USER, updateUserDto, {userId: id});

    // Return a success message
    return 'User updated successfully';
  }

  async deleteUser(id: string) {
    // Ensure the user exists by checking the userId
    await this.getUserOrThrow({userId: id});

    // Delete the user from the repository using the userId
    this.userRepository.deleteUser(SchemaConstants.USER, {userId: id});

    // Return a success message
    return 'User deleted successfully';
  }

  async getUserOrThrow(columnsAndValue: any) {
    // Retrieve user based on columns and values from the user repository
    const user = await this.userRepository.getUser(SchemaConstants.USER, columnsAndValue);

    // If the user is not found, throw a NotFoundException
    if (!user) {
      throw new NotFoundException(`User not found!`);
    }

    // Return the found user
    return user;
  }

  async duplicateOrThrow(collectionName: string, columnsAndValue: any) {
    // Retrieve a user based on column name and values from the user repository
    const duplicate = await this.userRepository.getUser(collectionName, columnsAndValue);

    // If a duplicate is found, throw a ConflictException with detailed information
    if (duplicate) {
      const duplicateValueString = Object.entries(columnsAndValue)
        .map(([key, value]) => `${key}: ${value}`)
        .join(', ');

      throw new ConflictException(`Duplicate ${collectionName} ${duplicateValueString}`);
    }

    return;
  }
}
