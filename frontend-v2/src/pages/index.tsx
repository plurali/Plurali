import { HeroWrapper } from "@/components/landing/hero/HeroWrapper";
import { ButtonLink } from "@/components/ui/elements/Button";
import { PageWrapper } from "@/components/ui/motion/PageWrapper";
import mainBg from "@/assets/mainBg.svg"
import { HeroTitle } from "@/components/landing/hero/HeroTitle";
import { HeroSubtitle } from "@/components/landing/hero/HeroSubtitle";
import { DocumentIcon, InboxStackIcon, PencilIcon, PhotoIcon, UserIcon, UsersIcon } from "@heroicons/react/24/outline";
import { hasWindow, icon } from "@/app/utils";

const mainBackground = {
  background: `url(${mainBg.src}) no-repeat`,
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
};

export default function Index() {
  if (hasWindow()) {
    document.body.style.backgroundColor = '#fff';
  }

  return (
    <PageWrapper>
      <HeroWrapper style={mainBackground} className="!py-56">
        <div className="flex flex-col-reverse md:flex-row h-full max-w-7xl w-full mx-auto">
          <div className="w-full h-full flex justify-center md:justify-start items-center">
            <div className="text-center md:text-left">
              <div className="text-white mb-8">
                <h1 className="text-6xl md:text-8xl font-medium">Plurali</h1>
                <h1 className="text-2xl md:text-4xl font-medium">Creative pages for your system</h1>
              </div>
              <div>
                <ButtonLink href="/invite" target="_blank" rel="noopenner noreferrer" className="text-black font-medium bg-white py-3.5 px-8 rounded-full">
                  Start using Plurali now!
                </ButtonLink>
              </div>
            </div>
          </div>
        </div>
      </HeroWrapper>
      <div className="pt-6 flex flex-col">
        <div className="flex flex-col lg:flex-row h-full w-full">
          <div className="w-full pb-6 lg:pr-6">
            <HeroWrapper hoverable={true} href="/about/fun" className="bg-cyan-400">
              <div>
                <HeroTitle>Synchronized with Simply Plural. Continuously.</HeroTitle>
                <HeroSubtitle>Plurali uses your Simply Plural for info about your system and it's members.</HeroSubtitle>
              </div>
              <div className="flex flex-col md:flex-row gap-4 w-full h-full mt-10 items-center justify-evenly">
                <div className="flex flex-col w-full justify-center items-center">
                  <UsersIcon className={icon.smallToMedium} />
                  <p className="w-full font-bold text-center text-white">System</p>
                </div>
                <div className="flex flex-col w-full justify-center items-center">
                  <UserIcon className={icon.smallToMedium} />
                  <p className="w-full font-bold text-center text-white">Member</p>
                </div>
                <div className="flex flex-col w-full justify-center items-center">
                  <InboxStackIcon className={icon.smallToMedium} />
                  <p className="w-full font-bold text-center text-white">Custom Fields</p>
                </div>
              </div>
            </HeroWrapper>
          </div>
          <div className="w-full pb-6">
            <HeroWrapper hoverable={true} className="bg-teal-400">
              <div>
                <HeroTitle>Easy to use.</HeroTitle>
                <HeroSubtitle>Pluralli provides a simple yet powerful dashb .</HeroSubtitle>
              </div>
              <div className="flex w-full h-full mt-10 items-center justify-evenly">
                <div className="flex flex-col w-full justify-center items-center">
                  <PencilIcon className={icon.smallToMedium} />
                  <p className="w-full font-bold text-center text-white">Rich Editor</p>
                </div>
                <div className="flex flex-col w-full justify-center items-center">
                  <DocumentIcon className={icon.smallToMedium} />
                  <p className="w-full font-bold text-center text-white">Custom content pages</p>
                </div>
                <div className="flex flex-col w-full justify-center items-center">
                  <PhotoIcon className={icon.smallToMedium} />
                  <p className="w-full font-bold text-center text-white">Customizable background</p>
                </div>
              </div>
            </HeroWrapper>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
