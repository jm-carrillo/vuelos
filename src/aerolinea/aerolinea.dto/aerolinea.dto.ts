/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsString, IsUrl, IsDateString } from "class-validator";

export class AerolineaDto {

    @IsString()
    @IsNotEmpty()    
    readonly nombre: string;
    
    @IsString()
    @IsNotEmpty()
    readonly descripcion: string;
    
    @IsDateString()
    @IsNotEmpty()
    readonly fechaFundacion: string;

    @IsUrl()
    @IsNotEmpty()
    readonly paginaWeb: string;
}
