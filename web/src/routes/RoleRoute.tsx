import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";
import { ReactElement } from "react";

interface RoleRouteProps {
  element: ReactElement;
  requiredRole: "admin" | "user";
}

const RoleRoute = ({ element, requiredRole }: RoleRouteProps) => {
  const [status, setStatus] = useState<"loading" | "allowed" | "denied">(
    "loading",
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setStatus("denied");
        return;
      }

      let role: string | undefined;

      // First check Users collection
      const userDoc = await getDoc(doc(db, "Users", user.uid));
      if (userDoc.exists()) {
        role = userDoc.data()?.role;
      }

      // If not found, check Admin collection
      if (!role) {
        const adminDoc = await getDoc(doc(db, "Admin", user.uid));
        if (adminDoc.exists()) {
          role = adminDoc.data()?.role; // or adminDoc.data()?.role if you store it
        }
      }

      if (role === requiredRole) {
        setStatus("allowed");
      } else {
        setStatus("denied");
      }
    });
    return () => unsubscribe();
  }, [requiredRole]);

  if (status === "loading") return <div>Loading...</div>;
  return status === "allowed" ? (
    element
  ) : (
    <Navigate to={`/${requiredRole}-login`} />
  );
};

export default RoleRoute;
