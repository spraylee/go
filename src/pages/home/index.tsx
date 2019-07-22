import React from 'react'

interface Props {
  title: string
}

const app: React.FC<Props> = props => {
  return <div>{props.title}</div>
}

export default app
