import { Button, Heading, Section, Text } from '@react-email/components';
import { BaseEmail } from './components/BaseEmail';
import { CopyPaste } from './components/CopyPaste';

export interface UserVerificationEmailProps {
  link: string;
  username: string;
}

export const UserVerificationEmail = ({ link = '', username = '' }: UserVerificationEmailProps) => {
  return (
    <BaseEmail previewText="Verify your account at Plurali">
      <Heading className="text-black text-4xl font-normal p-0 mb-8 mx-0">
        Verify your account at <b>Plurali</b>
      </Heading>

      <Text className="text-black text-md">Welcome to Plurali, {username},</Text>

      <Text className="text-black text-md">
        please click below to verify your email address associated to your Plurali account.
      </Text>

      <Section className="text-center my-8">
        <Button pX={20} pY={12} className="rounded-lg bg-violet-700 text-white" href={link}>
          Verify your account
        </Button>
      </Section>

      <CopyPaste link={link} />
    </BaseEmail>
  );
};
