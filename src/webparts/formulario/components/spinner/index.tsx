import * as React from 'react'
import styles from './Spinner.module.scss'

const Spinner = () => {
  return (
    <div className={styles.lds_dual_ring} />
  )
}

export default Spinner