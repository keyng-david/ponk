import { useUnit } from "effector-react";
import { useEffect, useState } from "react";
import { clickerModel } from "@/features/clicker/model";
import { useAuth } from "@/features/auth/useAuth";

export const useGameData = () => {
    const { valueInited, availableInited } = useAuth();
    const { $value, $available } = clickerModel;

    // Initialize local state with the current Effector store values
    const [score, setScore] = useState<number>($value.getState() ?? 0);
    const [availableClicks, setAvailableClicks] = useState<number>($available.getState() ?? 0);

    useEffect(() => {
        // Update local state whenever Effector store changes
        const unsubscribeValue = $value.watch((value) => {
            if (value !== null) setScore(value);
        });
        const unsubscribeAvailable = $available.watch((available) => {
            if (available !== null) setAvailableClicks(available);
        });

        return () => {
            unsubscribeValue();
            unsubscribeAvailable();
        };
    }, [$value, $available]);

    // Function to update both local state and Effector store
    const updateScoreAndAvailable = (newScore: number, newAvailable: number) => {
        setScore(newScore);
        setAvailableClicks(newAvailable);
        valueInited(newScore);
        availableInited(newAvailable);
    };

    return { score, availableClicks, updateScoreAndAvailable };
};