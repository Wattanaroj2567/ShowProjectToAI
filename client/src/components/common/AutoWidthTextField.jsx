import React, { useMemo } from 'react'
import TextField from '@mui/material/TextField'

export function measureCh(text, { min = 16, max = 60, pad = 2 } = {}) {
  const len = String(text || '').length
  return Math.min(max, Math.max(min, len + pad))
}

export default function AutoWidthTextField({ value, widthCh, minCh = 16, maxCh = 60, padCh = 2, sx, ...rest }) {
  const computed = useMemo(() => measureCh(value, { min: minCh, max: maxCh, pad: padCh }), [value, minCh, maxCh, padCh])
  const w = widthCh ?? computed
  return (
    <TextField
      {...rest}
      value={value}
      sx={{ width: `${w}ch`, maxWidth: '100%', ...sx }}
    />
  )
}
