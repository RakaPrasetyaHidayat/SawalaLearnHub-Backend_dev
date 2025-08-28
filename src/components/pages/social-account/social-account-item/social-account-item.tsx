import Image from 'next/image'

interface SocialAccount {
  id: number;
  platform: string;
  username: string;
  icon: string;
  color: string;
}

interface SocialAccountItemProps {
  account: SocialAccount;
}

export function SocialAccountItem({ account }: SocialAccountItemProps) {
  return (
    <div className="flex items-center pt-2 pb-2 pl-4 pr-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer">
      {/* Platform Icon */}
      <div className={`w-10 h-10 rounded-lg flex`}>
        <Image
          src={account.icon}
          alt={`${account.platform} icon`}
          width={40}
          height={40}
          className="w-[100%] h-[100%]"
        />
      </div>
      
      {/* Username only - no platform name */}
      <div className="ml-4 flex-1">
        <p className="text-md font-semibold">
          {account.username}
        </p>
      </div>
    </div>
  );
}
