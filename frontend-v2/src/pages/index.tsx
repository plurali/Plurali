import { ButtonLink } from "@/components/ui/elements/Button";
import { Subtitle } from "@/components/ui/typography/Subtitle";
import { Title } from "@/components/ui/typography/Title";

export default function Index() {
  return (
    <>
      <div className="mb-5">
        <Title>Plurali</Title>
        <Subtitle
        >
          Informative page about your system and it's members you can share with people!
        </Subtitle>
      </div>

      <div className="inline-flex items-center gap-2">
        <ButtonLink href="/dashboard" className="text-white bg-violet-700"> Dashboard </ButtonLink>
      </div>
    </>
  );
}
