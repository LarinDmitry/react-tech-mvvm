import { observer } from 'mobx-react-lite';

import styles from './Header.module.css';
import { useHeader } from './useHeader';

export const Header = observer(function Header() {
  const vm = useHeader();

  return <header className={styles.header}>{vm.title}</header>;
});
