import React from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import arrayMove from 'array-move'
import 'styles/order-choice.scss'

export default function OrderChoice({ className, order, onOrderChanged, id }) {
  const [active, setActive] = React.useState(null)
  const onDragEnd = ({ destination, source }) => {
    setActive(null)
    if (!destination || destination.index === source.index) return

    const newOrder = arrayMove(order, source.index, destination.index)
    onOrderChanged(newOrder)
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId={id}>
        {(provided) => (
          <div
            className={classNames('OrderChoice', className)}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            {order.map((val, i) => (
              <Item
                active={val.value === active}
                key={val.value}
                id={val.value}
                index={i}
              >
                {val.label}
              </Item>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}

OrderChoice.propTypes = {
  onOrderChanged: PropTypes.func.isRequired,
  order: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
}

function Item({ index, id, active, children }) {
  return (
    <Draggable index={index} draggableId={`${id}`}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={classNames('OrderChoice__Item', {
            OrderChoice__Item_active: active,
          })}
          ref={provided.innerRef}
        >
          {children}
        </div>
      )}
    </Draggable>
  )
}
