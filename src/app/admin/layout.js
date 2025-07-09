'use server';

//import { isAdmin } from "../functions/functions";

export default async function RootLayout({ children }) {
 // await isAdmin();
  
  return (
    <>
      {children}
    </>
  );
}