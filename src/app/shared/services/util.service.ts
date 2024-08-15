import {Injectable} from '@nestjs/common';

@Injectable()
export class UtilService {
  capitalizeText(text: string): string {
    const formattedText = text.trim();

    if (formattedText.length === 0) {
      return '';
    } else if (formattedText.length === 1) {
      return formattedText.toUpperCase();
    } else {
      return formattedText.charAt(0).toUpperCase() + formattedText.slice(1).toLowerCase();
    }
  }

  generateUniqueId(prefix: string): string {
    const currentTimeStamp = new Date().getTime();
    const timeStampString = currentTimeStamp.toString().slice(6);
    const randomIntegers = Math.floor(100000 + Math.random() * 900000);
    const uniqueId = `${prefix}${timeStampString}${randomIntegers}`;
    return uniqueId;
  }
  getEnvironmentSpecificValue<T>(dev: T, production: T): T {
    return process.env.NODE_ENV === 'production' ? production : dev;
  }

  convertDateTimeUtcToLocal(utcDate: Date): string {
    const date = new Date(utcDate);

    // Add 5 hours and 30 minutes to convert to local time
    date.setHours(date.getHours());
    date.setMinutes(date.getMinutes());

    // Format the date to YYYY-MM-DDTHH:MM:SS without milliseconds
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  convertDateUtcToLocal(utcDate: Date): string {
    const date = new Date(utcDate);

    // Add 5 hours and 30 minutes to convert to local time
    date.setHours(date.getHours());
    date.setMinutes(date.getMinutes());

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }
}
