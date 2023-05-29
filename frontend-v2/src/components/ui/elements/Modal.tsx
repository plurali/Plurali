import { Dialog, } from "@headlessui/react"
import { ModelProps } from "@/components/types/utils"
import { Fragment, PropsWithChildren, ReactNode, useMemo } from "react"
import { Transition } from "@headlessui/react"
import { Spinner } from "./Spinner"
import { c } from "@/app/utils"
import { XMarkIcon } from "@heroicons/react/24/outline"
import { Button } from "./Button"

export interface ModalProps extends PropsWithChildren<ModelProps<boolean>> {
    title: string,
    goBack?: string | null,
    loading?: boolean,
    color?: 'warning' | 'error' | 'success' | 'info' | string | null,
    renderIcon?: () => ReactNode
    renderHeader?: () => ReactNode
}

export const Modal = ({
    title,
    value,
    setValue,
    loading = false,
    goBack,
    color,
    renderIcon,
    renderHeader,
    children
}: ModalProps) => {
    const iconContainerColorClass = useMemo(() => color ? {
        warning: 'bg-orange-100',
        error: 'bg-red-100',
        success: 'bg-green-100',
        info: 'bg-blue-100',
    }[color] ?? null : null, [color]);

    const iconColorClass = useMemo(() => color ? {
        warning: 'text-orange-600',
        error: 'text-red-600',
        success: 'text-green-600',
        info: 'text-blue-600',
    }[color] ?? null : null, [color]);
    return (
        <Transition.Root as={Fragment} show={value}>
            <Dialog as="div" className="relative z-10" onClose={() => !loading && setValue(false)}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-white bg-opacity-25 backdrop-blur-sm transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform overflow-hidden rounded-2xl bg-white p-8 text-left shadow-2xl transition-all sm:my-8 sm:max-w-sm lg:max-w-7xl !w-full"
                            >
                                {loading &&
                                    <div className="absolute inset-0 w-full h-full bg-white bg-opacity-75 flex justify-center items-center cursor-default z-10">
                                        <Spinner className="!text-violet-700 !w-12 !h-12" />
                                    </div>}
                                <div className="border-b-2 mb-6 pb-6 flex justify-between items-center gap-3">
                                    <div className="inline-flex items-center justify-start gap-3">
                                        {iconContainerColorClass && (
                                            <div
                                                className={c("inline-flex h-16 w-16 items-center justify-center rounded-full", iconContainerColorClass)}
                                            >
                                                {iconColorClass && (
                                                    <XMarkIcon className={c("h-8 w-8", iconColorClass)} />
                                                )}
                                                {renderIcon?.()}
                                            </div>
                                        )}
                                        <Dialog.Title as="h2" className="font-semibold leading-6 text-2xl lg:text-3xl text-gray-900">
                                            {title}
                                        </Dialog.Title>
                                    </div>

                                    {renderHeader?.()}
                                </div>

                                <div>
                                    {children}
                                </div>

                                <div className="mt-2 sm:mt-3">
                                    <slot name="footer"></slot>
                                    {goBack && (
                                        <Button
                                            disabled={loading}
                                            type="button"
                                            className="inline-flex w-full justify-end bg-red-700 text-white font-semibold"
                                            onClick={() => !loading && setValue(false)}
                                        >
                                            {goBack}
                                        </Button>
                                    )}
                                </div>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div >
            </Dialog>
        </Transition.Root >
    )
}