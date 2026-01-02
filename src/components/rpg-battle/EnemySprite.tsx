import React from 'react'

export function EnemySprite() {
  return (
    <div className="flex items-end justify-end">
      <img
        src="/games/rpg-battle/enemy_slime_pose_sheet_3x3.png"
        alt="Enemy sprite sheet"
        className="h-40 w-40 rounded-lg border bg-muted/40 object-contain"
      />
    </div>
  )
}
