/* eslint-disable prettier/prettier */
import { CallHandler, ExecutionContext, HttpException, HttpStatus, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class ErroresDeNegocioInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle()
      .pipe(catchError(error => {
        if (error.status === HttpStatus.NOT_FOUND && error.message != "Http Exception")
          throw new HttpException({mensaje: error.message, codigo: HttpStatus.NOT_FOUND}, HttpStatus.NOT_FOUND);
        else if (error.status === HttpStatus.PRECONDITION_FAILED && error.message != "Http Exception")
          throw new HttpException({mensaje: error.message, codigo: HttpStatus.PRECONDITION_FAILED}, HttpStatus.PRECONDITION_FAILED);
        else if (error.status === HttpStatus.BAD_REQUEST && error.message != "Http Exception")
          throw new HttpException({mensaje: error.message, codigo: HttpStatus.BAD_REQUEST}, HttpStatus.BAD_REQUEST);
        else
          throw error;
      }));
  }
}
