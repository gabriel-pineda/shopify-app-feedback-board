import { useEffect, useState, useId, useMemo } from "react";
import type { HeadersFunction, LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { boundary } from "@shopify/shopify-app-react-router/server";
import db from "../db.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const { session, admin } = await authenticate.admin(request);

  // Query the database to get full session with user information
  const sessionData = await db.session.findUnique({
    where: { id: session.id },
  });

  let userInfo = {
    id: sessionData?.userId?.toString() || null,
    email: sessionData?.email || null,
    firstName: sessionData?.firstName || null,
    lastName: sessionData?.lastName || null,
    fullName: null as string | null,
    shop: sessionData?.shop || null,
  };

  // Check for onlineAccessInfo (available when using online tokens)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onlineAccessInfo = (session as any).onlineAccessInfo;
  if (onlineAccessInfo?.associated_user) {
    const associatedUser = onlineAccessInfo.associated_user;
    userInfo = {
      id: associatedUser.id?.toString() || userInfo.id,
      email: associatedUser.email || userInfo.email,
      firstName: associatedUser.first_name || userInfo.firstName,
      lastName: associatedUser.last_name || userInfo.lastName,
      fullName: null,
      shop: sessionData?.shop || userInfo.shop,
    };
  }

  // If user info is still not available, try to get it from Admin API
  if (!userInfo.email || !userInfo.firstName) {
    try {
      // Query for shop information (this is always available)
      const response = await admin.graphql(
        `#graphql
          query {
            shop {
              id
              name
              email
              myshopifyDomain
            }
          }`
      );

      const responseJson = await response.json();
      const shopData = responseJson.data?.shop;

      if (shopData && !userInfo.email) {
        // Use shop email as fallback
        userInfo.email = shopData.email || userInfo.email;
      }
    } catch (error) {
      console.error("Error fetching shop info from Admin API:", error);
    }
  }

  // Set full name
  userInfo.fullName = `${userInfo.firstName || ""} ${userInfo.lastName || ""}`.trim() || null;

  return {
    user: userInfo,
  };
};

const TARGET_CONTAINER_ID = "changelog-component";

export default function Changelog() {
  const { user } = useLoaderData<typeof loader>();
  const appBridge = useAppBridge();
  const sessionKey = useId();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [appBridgeUser, setAppBridgeUser] = useState<any>(null);

  // Try to get user info from App Bridge (for embedded apps)
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (appBridge && (appBridge as any).features?.User) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (appBridge as any).features.User.getCurrentUser().then((userData: any) => {
        console.log("App Bridge User:", userData);
        setAppBridgeUser(userData);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }).catch((error: any) => {
        console.log("Could not get user from App Bridge:", error);
      });
    }
  }, [appBridge]);

  // Merge App Bridge user info if available
  const displayUser = useMemo(() => {
    return user.id && user.email ? user : (appBridgeUser ? {
      id: appBridgeUser.id || null,
      email: appBridgeUser.email || null,
      firstName: appBridgeUser.firstName || null,
      lastName: appBridgeUser.lastName || null,
      fullName: `${appBridgeUser.firstName || ""} ${appBridgeUser.lastName || ""}`.trim() || null,
      shop: user.shop || null,
    } : user);
  }, [user, appBridgeUser]);

  useEffect(() => {
    // Add CSS to make widget full width and break out of parent max-width constraints
    const style = document.createElement("style");
    style.textContent = `
      s-page,
      s-page > *,
      s-page > * > * {
        max-width: none !important;
      }
      #${TARGET_CONTAINER_ID} {
        width: 100vw !important;
        max-width: 100vw !important;
        margin-left: calc(-50vw + 50%) !important;
        margin-right: calc(-50vw + 50%) !important;
        padding: 2rem !important;
        position: relative !important;
        left: 0 !important;
        right: 0 !important;
      }
      #${TARGET_CONTAINER_ID} > * {
        width: 100% !important;
        max-width: 100% !important;
      }
    `;
    document.head.appendChild(style);

    // Check if script is already loaded
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).loadChangelog) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).loadChangelog(TARGET_CONTAINER_ID);
      return;
    }

    // Create script element
    const script = document.createElement("script");
    script.src = `https://features.vote/widget/widget.js?sessionKey=${sessionKey}`;
    script.async = true;

    // Set widget parameters as data attributes
    script.setAttribute("slug", "pulse"); // Update with your project slug
    script.setAttribute("color_mode", "light"); // or "dark"
    script.setAttribute("variant", "v2"); // Required for changelog
    
    // Pass user information if available
    if (displayUser.id) {
      script.setAttribute("user_id", displayUser.id);
    }
    if (displayUser.email) {
      script.setAttribute("user_email", displayUser.email);
    }
    if (displayUser.fullName) {
      script.setAttribute("user_name", displayUser.fullName);
    }

    // Load the widget when script loads
    script.onload = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if ((window as any).loadChangelog) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).loadChangelog(TARGET_CONTAINER_ID);
      }
    };

    document.head.appendChild(script);

    // Cleanup
    return () => {
      const existingScript = document.querySelector(
        `script[src*="features.vote/widget/widget.js"]`
      );
      if (existingScript) {
        existingScript.remove();
      }
      style.remove();
    };
  }, [sessionKey, displayUser]);

  return (
    <s-page heading="Changelog">
      <div 
        id={TARGET_CONTAINER_ID}
        style={{
          width: '100%',
          margin: 0,
          padding: '2rem',
          position: 'relative',
        }}
      ></div>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};

