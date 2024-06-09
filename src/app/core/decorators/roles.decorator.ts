// custom-metadata.decorator.ts
import {SetMetadata} from '@nestjs/common';

export const Roles = (metadata: string) => SetMetadata('role', metadata);
