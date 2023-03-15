import React from 'react'

const Notify = ({handelMouseenter,handelMouseleave,handeltooltipenter,handeltooltipleave,notifydetail}) => {
  return (
    <>
        <Badge>{notifydetail.count > 0 ? notifydetail.count :''}</Badge>
        <Notifications sx={{ width :20, height:20}} id='notify' color="primary" onMouseEnter={handelMouseenter} onMouseLeave={handelMouseleave}/>
            {show === 'notify' && 
            <div className={classes.notifycon} onMouseEnter={handeltooltipenter} onMouseLeave={handeltooltipleave}>
        
                {notifydetail.count > 0 ?
                    <ul>
                       {allnotify}
                    </ul>:
                    <p>No Notification</p>}
    
            </div>}
    </>
  )
}

export default Notify