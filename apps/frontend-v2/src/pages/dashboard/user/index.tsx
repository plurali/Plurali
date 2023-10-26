import { Authenticated } from "@/components/Authenticated";
import { Button } from "@/components/ui/elements/Button";
import { Label } from "@/components/ui/form/Label";
import { Subtitle } from "@/components/ui/typography/Subtitle";
import { Title } from "@/components/ui/typography/Title";
import { useUserMutation } from "@/hooks/user/mutation";
import { useGoBack } from "@/store/goBack";
import { UpdateUserRequestInterface } from "@app/v2/dto/user/request/UpdateUserRequestInterface";
import { UserRole } from "@prisma/client";
import { useState } from "react"
import { useForm } from "react-hook-form"

export const UserPage = () => {
    const [submitting, setSubmitting] = useState(false);
    const {
        register,
        handleSubmit
    } = useForm<UpdateUserRequestInterface>();
    const mutation = useUserMutation();

    useGoBack("/dashboard");

    const onSubmit = async (data: UpdateUserRequestInterface) => {
        setSubmitting(true);
    
        try {
          await mutation.mutateAsync(data);
        } catch (e) {
          console.error('Failed to toggle visibility for system', { data, e });
        }
    
        setSubmitting(false);
      };

    return (
        <Authenticated>
            {(user) => (
                <>
                    <div className="mb-5">
                        <Title>Account settings</Title>
                        <Subtitle>Settings of your Plurali account</Subtitle>
                    </div>

                    <form className="mb-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                        <div className="mb-3.5">
                            <Label>Simply Plural API key</Label>
                            <input
                                disabled={submitting}
                                {...register("accessToken")}
                                className="w-full p-2.5 border rounded-xl border-gray-400"
                                placeholder="Simply Plural API key"
                                defaultValue={user.accessToken ?? ''}
                            />
                        </div>

                        {user.role === UserRole.Admin && (
                            <div className="mb-3.5">
                                <Label>Override Plural ID</Label>
                                <input
                                    disabled={submitting}
                                    {...register("systemIdOverride")}
                                    className="w-full p-2.5 border rounded-xl border-gray-400"
                                    placeholder="Override Plural ID"
                                    defaultValue={user.systemIdOverride ?? ''}
                                />
                            </div>
                        )}

                        <Button
                            type="submit"
                            loading={submitting}
                            disabled={submitting}
                            className="w-full border border-violet-700 text-violet-700 mb-1 inline-flex justify-between items-center"
                        >
                            <p>Update user settings</p>
                        </Button>
                    </form>
                </>
            )}
        </Authenticated>
    )
}

export default UserPage;