import { useCallback, useState } from "react";
import { router } from "@inertiajs/react";
import { toast } from "sonner";
import { route } from "ziggy-js";

export const useNavigate = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useCallback(
        ({ url, method = "get", params = {}, data = {}, options = {} }) => {
            // eslint-disable-next-line no-undef
            const endpoint = url.includes(".")
                ? route(url, params, undefined)
                : url;

            const routeOptions = {
                onError: (e) => {
                    console.log(e)
                    setError(e);
                    e &&
                        Object.keys(e).length &&
                        toast.error(e[Object.keys(e)[0]]);
                },
                onStart: () => setIsLoading(true),
                onFinish: () => setIsLoading(false),
                onSuccess: (e) => setIsSuccess(e),

                ...(options || {}),
                ...(options.onSuccess && {
                    onSuccess: (e) => options.onSuccess(e, toast),
                }),
                ...(options.onError && {
                    onError: (e) => options.onError(e, toast),
                }),
            };

            switch (method.toLowerCase()) {
                case "get":
                    router.get(endpoint, routeOptions);
                    break;
                case "post":
                    router.post(endpoint, data, routeOptions);
                    break;
                case "put":
                    router.post(
                        endpoint,
                        { ...data, _method: "put" },
                        routeOptions,
                    );
                    break;
                case "delete":
                    router.delete(endpoint, routeOptions);
                    break;
                default:
                    console.error("Unsupported method:", method);
            }
        },
        [],
    );

    return { navigate, isLoading, isSuccess, error };
};
