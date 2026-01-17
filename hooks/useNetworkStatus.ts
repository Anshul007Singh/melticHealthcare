import NetInfo, { NetInfoState } from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

export interface NetworkStatus {
  /** Whether device is connected to internet */
  isConnected: boolean;
  /** Whether network is currently reachable */
  isInternetReachable: boolean | null;
  /** Type of connection (wifi, cellular, none, etc.) */
  type: string;
}

/**
 * useNetworkStatus Hook
 *
 * Monitors network connectivity status in real-time.
 * Requires @react-native-community/netinfo to be installed.
 *
 * @returns Current network status
 *
 * @example
 * ```tsx
 * const { isConnected, isInternetReachable, type } = useNetworkStatus();
 *
 * if (!isConnected) {
 *   return <NetworkBanner visible={true} />;
 * }
 * ```
 */
export function useNetworkStatus(): NetworkStatus {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatus>({
    isConnected: true,
    isInternetReachable: null,
    type: 'unknown',
  });

  useEffect(() => {
    // Subscribe to network state updates
    const unsubscribe = NetInfo.addEventListener((state: NetInfoState) => {
      setNetworkStatus({
        isConnected: state.isConnected ?? false,
        isInternetReachable: state.isInternetReachable,
        type: state.type,
      });
    });

    // Clean up subscription on unmount
    return () => {
      unsubscribe();
    };
  }, []);

  return networkStatus;
}

export default useNetworkStatus;
