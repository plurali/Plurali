import { Button, Heading, Section, Text } from '@react-email/components';
import { BaseEmail } from './components/BaseEmail';
import { CopyPaste } from './components/CopyPaste';
import { FormattedTimeWithUnit } from '@domain/common/time';

export interface UserPasswordResetEmailProps {
  link: string;
  username: string;
  expiry: FormattedTimeWithUnit;
}

export const UserPasswordResetEmail = ({
  link = '',
  username = '',
  expiry = { value: 5, unit: 'minutes' },
}: UserPasswordResetEmailProps) => {
  return (
    <BaseEmail previewText="Reset your Plurali account password">
      <Heading className="text-black text-4xl font-normal p-0 mb-8 mx-0">
        Reset your <b>Plurali</b> account password
      </Heading>

      <Text className="text-black text-md">Dear {username},</Text>

      <Text className="text-black text-md">
        please click below to reset the password to your Plurali account. This link expires in {expiry.value}{' '}
        {expiry.unit}.
      </Text>

      <Section className="text-center my-8">
        <Button pX={20} pY={12} className="rounded-lg bg-violet-700 text-white" href={link}>
          Reset password
        </Button>
      </Section>

      <CopyPaste link={link} />
    </BaseEmail>
  );
};
