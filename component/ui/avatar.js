import {Avatar,Badge} from '../../node_modules/@mui/material'
import React from 'react'

function Avatar() {
  return (
    <div className={classes.avatarbor} onMouseEnter={handelMouseenter} onMouseLeave={handelMouseleave}>
        <Badge className={offline ? classes.badgeof : classes.badge} ></Badge>
        <Avatar src={userdetail.photo ? userdetail.photo : ''} width={50} height={50} >{userdetail.email.slice(0,1)}</Avatar>
    </div>
  )
}

export default Avatar