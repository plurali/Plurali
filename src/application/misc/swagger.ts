import { DocumentBuilder } from "@nestjs/swagger";

export const swagger = new DocumentBuilder()
  .setTitle('Plurali REST API')
  .setVersion('2.0')

  // V1
  .addTag('AuthV1')
  .addTag('UserV1')

  .addTag('SystemV1')
  .addTag('SystemPublicV1')
  .addTag('SystemFieldV1')

  .addTag('SystemMemberV1')
  .addTag('SystemMemberPublicV1')

  .addTag('SystemPageV1')
  .addTag('SystemPagePublicV1')

  .addTag('SystemMemberPageV1')
  .addTag('SystemMemberPagePublicV1')

  // V2
  .addTag('System')
  .addTag('SystemPublic')
  .addTag('SystemField')
  .addTag('SystemPage')
  .addTag('SystemFieldPublic')
  .addTag('SystemPagePublic')

  .addTag('Member')
  .addTag('MemberField')
  .addTag('MemberPage')
  .addTag('MemberFieldPublic')
  .addTag('MemberPagePublic')
  .addTag('Notification')

  .addBearerAuth()

  .build();
