import React from 'react'
import { Group, Circle, Text } from 'react-konva'

export default function TrashPortal({ x, y }: { x: number, y: number }) {
  return (
    <Group x={x} y={y}>
        {/* Portal Visual - Swirling Purple */}
        <Circle radius={40} fill="#7e22ce" stroke="#d8b4fe" strokeWidth={4} />
        <Circle radius={30} fill="#6b21a8" />
        <Circle radius={20} fill="#581c87" />
        <Text text="TRASH" fontSize={12} fill="white" fontStyle="bold" x={-20} y={-5} />
    </Group>
  )
}
