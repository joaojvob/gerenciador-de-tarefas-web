import { ChakraProvider, defaultSystem } from "@chakra-ui/react";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../contexts/AuthContext";

function AppProviders({ children }) {
    return (
        <ChakraProvider value={defaultSystem}>
            <BrowserRouter>
                <AuthProvider>{children}</AuthProvider>
            </BrowserRouter>
        </ChakraProvider>
    );
}

export default AppProviders;
