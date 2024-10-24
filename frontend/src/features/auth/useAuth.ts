import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { createEvent, createStore } from "effector";
import { useUnit } from "effector-react";
import { useSessionId } from "@/shared/model/session";
import { walletModel } from "@/shared/model/wallet";
import { randModel } from "@/shared/model/rang";
import { useErrorHandler } from "@/shared/lib/hooks/useErrorHandler";
import { clickerModel } from "@/features/clicker/model";


const setSessionId = createEvent<string>();
const $sessionId = createStore<string | null>(null).on(setSessionId, (_, id) => id);

const setIsAuth = createEvent<boolean>();
const $isAuth = createStore(false).on(setIsAuth, (_, value) => value);

const setUserName = createEvent<string>();
const $userName = createStore<string | null>(null).on(setUserName, (_, name) => name);

// New global stores for game data
const { valueInited, availableInited } = clickerModel;

const setClickStep = createEvent<number>();
const $clickStep = createStore<number | null>(null).on(setClickStep, (_, step) => step);

const setSkin = createEvent<string>();
const $skin = createStore<string | null>(null).on(setSkin, (_, skin) => skin);

export const useAuth = () => {
  const navigate = useNavigate();
  const isAuth = useUnit($isAuth);
  const sessionIdStore = useSessionId();
  const wallet = walletModel.useWalletModel();
  const rangModel = randModel.useRang();
  const { setError } = useErrorHandler();
  const sessionId = useUnit($sessionId);
  const userName = useUnit($userName);
  const clickStep = useUnit($clickStep);
  const skin = useUnit($skin);

  const initialize = useCallback(async () => {
    if (isAuth) return; // Skip initialization if already authenticated

    console.log("initialize function called");
    try {
      console.log("User is not authenticated, starting authentication process");

      const urlParams = new URLSearchParams(window.location.search);
      const sessionIdFromUrl = urlParams.get("session_id");

      if (!sessionIdFromUrl) {
        console.error("No session ID found in the URL");
        setError("No session ID found");
        return;
      }

      console.log("Session ID found:", sessionIdFromUrl);
      sessionIdStore.set(sessionIdFromUrl);
      setSessionId(sessionIdFromUrl);

      const response = await fetch("/api/auth_handler.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sessionId: sessionIdFromUrl }),
      });

      if (!response.ok) {
        console.error("Authentication request failed with status:", response.status);
        setError("Authentication failed, invalid response");
        sessionIdStore.remove();
        return;
      }

      const data = await response.json();
      console.log("Authentication response data:", data);

      // Check if the response contains the expected structure
      if (!data.payload || typeof data.payload.score !== 'number' || typeof data.payload.available_clicks !== 'number') {
        throw new Error("Invalid data structure from API");
      }

      // Set the userName from the payload if available
      if (data.payload.username) {
        setUserName(data.payload.username);
      } else {
        console.warn("username is undefined");
      }

      // Store initial game data globally
      valueInited(data.payload.score);
      console.log("Initial Score set:", data.payload.score);
      availableInited(data.payload.available_clicks);
      console.log("Initial Available Clicks set:", data.payload.available_clicks);

      if (data.payload.wallet !== undefined) {
        wallet.updateWallet(data.payload.wallet);
      } else {
        console.warn("Wallet data is undefined");
      }

      if (typeof data.payload.level === 'number') {
        rangModel.update(data.payload.level);
      } else {
        console.warn("Level data is undefined or not a number");
      }
   
      if (typeof data.payload.click_step === 'number') {
        setClickStep(data.payload.click_step);
      } else {
        console.warn("click_step data is undefined or not a number");
      }

      if (data.payload.skin) {
        setSkin(data.payload.skin);
      } else {
        console.warn("Skin data is undefined");
      }

      setIsAuth(true);

      console.log("Navigating to /main");
      navigate("/main");
    } catch (e) {
      console.error("Error during initialization:", e);
      setError(`Error during authentication: ${e instanceof Error ? e.message : String(e)}`);
      sessionIdStore.remove();
    }
  }, [isAuth, sessionIdStore, wallet, rangModel, navigate, setError]);

  return {
    initialize,
    sessionId,
    isAuth,
    valueInited,
    userName,
    availableInited,
    clickStep,
    skin,
  };
};