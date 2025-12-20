import { useEffect, useState } from "react";
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

  // Log user information
  console.log("=== Current User Information ===");
  console.log("User ID:", userInfo.id || "N/A");
  console.log("Email:", userInfo.email || "N/A");
  console.log("First Name:", userInfo.firstName || "N/A");
  console.log("Last Name:", userInfo.lastName || "N/A");
  console.log("Full Name:", userInfo.fullName || "N/A");
  console.log("Shop:", userInfo.shop || "N/A");
  console.log("Session isOnline:", sessionData?.isOnline || false);
  console.log("================================");

  return {
    user: userInfo,
  };
};

export default function RequestFeedback() {
  const { user } = useLoaderData<typeof loader>();
  const appBridge = useAppBridge();
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
  const displayUser = user.id && user.email ? user : (appBridgeUser ? {
    id: appBridgeUser.id || null,
    email: appBridgeUser.email || null,
    firstName: appBridgeUser.firstName || null,
    lastName: appBridgeUser.lastName || null,
    fullName: `${appBridgeUser.firstName || ""} ${appBridgeUser.lastName || ""}`.trim() || null,
    shop: user.shop || null,
  } : user);

  return (
    <s-page heading="Request Feedback">
      <s-section heading="Request Feedback">
        <s-paragraph>
          This is the Request Feedback page. Add your feedback request form here.
        </s-paragraph>
        <s-section heading="Current User">
          <s-paragraph>
            <s-text>User ID: {displayUser.id || "N/A"}</s-text>
          </s-paragraph>
          <s-paragraph>
            <s-text>Email: {displayUser.email || "N/A"}</s-text>
          </s-paragraph>
          <s-paragraph>
            <s-text>Name: {displayUser.fullName || "N/A"}</s-text>
          </s-paragraph>
          <s-paragraph>
            <s-text>Shop: {displayUser.shop || "N/A"}</s-text>
          </s-paragraph>
          {!displayUser.id && (
            <s-paragraph>
              <s-text tone="warning">
                Note: User information is not available. This may be because the app is using offline tokens. 
                Try reinstalling the app after enabling online tokens.
              </s-text>
            </s-paragraph>
          )}
        </s-section>
      </s-section>
    </s-page>
  );
}

export const headers: HeadersFunction = (headersArgs) => {
  return boundary.headers(headersArgs);
};

