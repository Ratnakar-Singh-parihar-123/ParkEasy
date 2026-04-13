// import React, { createContext, useState, useContext, useEffect } from "react";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { demoUser, adminCredentials, adminUser } from "../data/parkingData";

// // Demo credentials
// const DEMO_EMAIL = "user@gmail.com";
// const DEMO_PASSWORD = "123456";

// const AuthContext = createContext({});

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     checkLoginState();
//   }, []);

//   const checkLoginState = async () => {
//     try {
//       const savedUser = await AsyncStorage.getItem("user");
//       if (savedUser) {
//         setUser(JSON.parse(savedUser));
//       }
//     } catch (error) {
//       console.log("Error checking login state:", error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const login = async (email, password) => {
//     const lowerEmail = email.toLowerCase();

//     // Check for admin credentials
//     if (
//       lowerEmail === adminCredentials.email &&
//       password === adminCredentials.password
//     ) {
//       const userData = { ...adminUser, email: lowerEmail };
//       await AsyncStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);
//       return { success: true, isAdmin: true };
//     }

//     // Check for demo user credentials
//     if (lowerEmail === DEMO_EMAIL && password === DEMO_PASSWORD) {
//       const userData = { ...demoUser, email: lowerEmail, role: "user" };
//       await AsyncStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);
//       return { success: true, isAdmin: false };
//     }

//     return { success: false, error: "Invalid email or password" };
//   };

//   const register = async (name, email, password) => {
//     // For demo, we'll just create a user with the provided info
//     // In real app, this would call backend API
//     if (email && password && name) {
//       const userData = {
//         ...demoUser,
//         name: name,
//         email: email.toLowerCase(),
//         role: "user",
//         memberSince: new Date().toLocaleDateString("en-US", {
//           month: "long",
//           year: "numeric",
//         }),
//       };
//       await AsyncStorage.setItem("user", JSON.stringify(userData));
//       setUser(userData);
//       return { success: true };
//     }
//     return { success: false, error: "Please fill all fields" };
//   };

//   const logout = async () => {
//     await AsyncStorage.removeItem("user");
//     setUser(null);
//   };

//   const updateUser = async (updatedData) => {
//     const newUserData = { ...user, ...updatedData };
//     await AsyncStorage.setItem("user", JSON.stringify(newUserData));
//     setUser(newUserData);
//   };

//   const isAdmin = user?.role === "admin";

//   return (
//     <AuthContext.Provider
//       value={{
//         user,
//         isLoading,
//         isLoggedIn: !!user,
//         isAdmin,
//         login,
//         register,
//         logout,
//         updateUser,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export default AuthContext;

import React, { createContext, useState, useContext, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/api";

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 🔄 Restore session
  useEffect(() => {
    const checkLoginState = async () => {
      try {
        const savedUser = await AsyncStorage.getItem("user");
        const token = await AsyncStorage.getItem("token");

        if (savedUser && token) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.log("Session restore error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginState();
  }, []);

  // 🔐 LOGIN
  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", { email, password });

      console.log("LOGIN RESPONSE:", res.data); // 🔍 debug

      const userData = res.data;

      if (!userData.token) {
        throw new Error("Token missing from backend");
      }

      await AsyncStorage.setItem("token", userData.token);
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(userData.user || userData),
      );

      setUser(userData.user || userData);

      return {
        success: true,
        isAdmin: (userData.user || userData).role === "admin",
      };
    } catch (error) {
      console.log("LOGIN ERROR:", error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || "Login failed",
      };
    }
  };

  // 📝 REGISTER
  const register = async (name, email, password, adminSecret = "") => {
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        adminSecret, // optional
      });

      console.log("REGISTER RESPONSE:", res.data); // 🔍 debug

      const userData = res.data;

      if (!userData.token) {
        throw new Error("Token missing from backend");
      }

      await AsyncStorage.setItem("token", userData.token);
      await AsyncStorage.setItem(
        "user",
        JSON.stringify(userData.user || userData),
      );

      setUser(userData.user || userData);

      return { success: true };
    } catch (error) {
      console.log("REGISTER ERROR:", error.response?.data || error.message);

      return {
        success: false,
        error: error.response?.data?.message || "Registration failed",
      };
    }
  };

  // 🚪 LOGOUT
  const logout = async () => {
    try {
      await AsyncStorage.multiRemove(["token", "user"]);
      setUser(null);
    } catch (error) {
      console.log("Logout error:", error);
    }
  };

  // 👤 UPDATE USER (frontend only)
  const updateUser = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };

      await AsyncStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
    } catch (error) {
      console.log("Update user error:", error);
    }
  };

  const isAdmin = user?.role === "admin";

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isLoggedIn: !!user,
        isAdmin,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 🔥 Hook
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};

export default AuthContext;
