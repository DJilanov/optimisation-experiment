import React from "react";
import { ItemProps } from "../types/common";

const Item = React.memo(({ item, onClick }: ItemProps) => {
  return (
    <span
      style={styles.span}
      onClick={onClick}
    >
      ID {item.id} - {item.name}
    </span>
  );
});

const styles = {
  span: {
    cursor: 'pointer',
    color: 'black'
  },
}

export default Item;
