import * as React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "@emotion/styled";
import { Task } from "../../core/types";

// Define types for board item element properties
type BoardItemProps = {
  index: number;
  task: Task;
};

// Define types for board item element style properties
// This is necessary for TypeScript to accept the 'isDragging' prop.
type BoardItemStylesProps = {
  isDragging: boolean;
};

// Create style for board item element
const BoardItemEl = styled.div<BoardItemStylesProps>`
  padding: 8px;
  min-height: 100px;
  margin-bottom: 12px;
  background-color: ${(props) =>
    props.isDragging
      ? "var(--vscode-editorGroup-dropBackground)"
      : "var(--vscode-tab-inactiveBackground)"};
  border-radius: 4px;
  transition: background-color 0.25s ease-out;

  &:hover {
    background-color: var(--vscode-editorGroupHeader-tabsBackground);
  }

  & + & {
    margin-top: 4px;
  }
`;

// Create and export the BoardItem component
export default function BoardItem(props: BoardItemProps) {
  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided, snapshot) => (
        <BoardItemEl
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {/* The content of the BoardItem */}
          <h3>{props.task.description}</h3>
        </BoardItemEl>
      )}
    </Draggable>
  );
}
