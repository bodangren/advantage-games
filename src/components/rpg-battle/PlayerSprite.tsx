import React from 'react'

export function PlayerSprite() {
  return (
    <div className="flex items-end justify-start">
      <img
        src="/games/rpg-battle/hero_male_pose_sheet_3x3.png"
        alt="Player sprite sheet"
        className="h-40 w-40 rounded-lg border bg-muted/40 object-contain"
      />
    </div>
  )
}
