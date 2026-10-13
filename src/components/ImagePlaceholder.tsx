import styles from './ImagePlaceholder.module.css'

interface Props {
  src?: string
  alt?: string
  rounded?: boolean
  className?: string
}

export function ImagePlaceholder({ src, alt = '', rounded, className = '' }: Props) {
  const classes = `${styles.box} ${rounded ? styles.rounded : ''} ${className}`
  return src ? (
    <img src={src} alt={alt} className={`${classes} ${styles.image}`} />
  ) : (
    <div className={classes} role="img" aria-label={alt || 'Image placeholder'} />
  )
}
