import { DocumentBuilder } from "@nestjs/swagger";

export const swagger = new DocumentBuilder()
    .setTitle("Plurali REST API")
    .setVersion('2.0')
    .addTag('User')
    .addTag('System')
    .addTag('SystemMember')
    .addTag('SystemField')
    .build();    
