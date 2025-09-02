"use client";

import { useRouter } from "next/navigation";
import BackButton from "@/components/atoms/ui/back-button";
import { Input } from "@/components/atoms/ui/input";
import { Button } from "@/components/atoms/ui/button";
import { useSocialAccount } from "../context/social-account-context";
import Image from 'next/image'

export function EditSocialAccountPage() {
    const router = useRouter();
    const { accounts, updateUsername } = useSocialAccount();

    const handleUsernameChange = (id: number, newUsername: string) => {
        updateUsername(id, newUsername);
    };

    const handleSave = () => {
        // Here you would typically save to backend/database
        console.log("Saving accounts:", accounts);
        // Go back to social account page
        router.push("/main-Page/profile/social");
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <div className="flex items-center p-4">
                <BackButton>
                    <Image src="/assets/icons/arrow-left.png" alt="Back" width={12} height={24} className="h-4 ml-1 cursor-pointer hover:bg-gray-100" />
                </BackButton>
                <h1 className="text-xl font-bold text-gray-900 ml-3">
                    Social Account
                </h1>
            </div>

            {/* Social Account Input Fields */}
            <div className="p-4 space-y-4">
                {accounts.map((account) => (
                    <div key={account.id} className="flex flex-col space-y-3">
                        {/* Platform Icon - Above Input Field */}
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-0`}>
                            <Image
                                src={account.icon}
                                alt={`${account.platform} icon`}
                                className="w-6 h-6"
                                width={24}
                                height={24}
                            />
                        </div>
                        
                        {/* Input Field */}
                        <div className="flex-1">
                            <Input
                                type="text"
                                value={`${account.baseUrl}${account.username}`}
                                onChange={(e) => {
                                    const fullUrl = e.target.value;
                                    const username = fullUrl.replace(account.baseUrl, '');
                                    handleUsernameChange(account.id, username);
                                }}
                                className="w-full"
                                placeholder={`${account.baseUrl}username`}
                            />
                        </div>
                    </div>
                ))}
            </div>

            {/* Save Button */}
            <div className="p-4">
                <Button
                    onClick={handleSave}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-lg"
                >
                    Save
                </Button>
            </div>
        </div>
    );
}
