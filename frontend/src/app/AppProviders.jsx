import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";
import { NotificationsProvider } from "../contexts/NotificationsContext";

function AppProviders({ children }) {
    return (
        <ChakraProvider value={defaultSystem}>
            <BrowserRouter>
                <AuthProvider>
                    <NotificationsProvider>{children}</NotificationsProvider>
                </AuthProvider>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default AppProviders;
