import * as React from "react";
import { useEffect, useRef } from "react";
import { useCallback } from "react";
import { ACTION, PRIORITY_COLORS } from "../core/constants";

export const PriorityColorsContext = React.createContext<any>([]);

export const PriorityColorsProvider = (props: any) => {
  const [priorityColors, _setPriorityColors] = React.useState(PRIORITY_COLORS);

  const priorityColorsRef = useRef<string[]>(priorityColors);
  const setPriorityColors = (data: string[]) => {
    priorityColorsRef.current = data;
    _setPriorityColors(priorityColorsRef.current);
  };

  const handleMsgEvent = useCallback((event: any) => {
    const message = event.data;
    if (message.action && message.data) {
      switch (message.action) {
        case ACTION.priorityColors:
          console.log(message.data);
          setPriorityColors(message.data);
          break;
      }
    }
  }, []);
  useEffect(() => {
    window.addEventListener("message", handleMsgEvent);
    // clean up
    return () =>
      window.removeEventListener("message", (event) => handleMsgEvent);
  }, [handleMsgEvent]);
  return (
    <PriorityColorsContext.Provider value={[priorityColors]}>
      {props.children}
    </PriorityColorsContext.Provider>
  );
};
