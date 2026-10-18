export function getCategoryIconPath(
  slugOrName?: string,
  icon?: string | null
): string | null {
  if (!slugOrName) return null;
  const s = slugOrName.toLowerCase().replace(/[^a-z0-9]/g, '-');

  // Specific Apple & Computers
  if (s.includes('macbook')) return '/categories/macbook.png';
  if (s.includes('ipad') || s.includes('tablet')) return '/categories/ipad.png';
  if (
    s.includes('iphone') ||
    s.includes('phone') ||
    s.includes('mobile') ||
    s.includes('galaxy') ||
    s.includes('pixel') ||
    s.includes('xiaomi') ||
    s.includes('oneplus')
  ) {
    return '/categories/iphone.png';
  }

  // Wearables & Watches
  if (s.includes('watch') || s.includes('wearable') || s.includes('band')) {
    return '/categories/smart-watch.png';
  }

  // Audio, Earbuds & Headphones
  if (s.includes('headphone') || s.includes('over-ear')) {
    return '/categories/headphone.png';
  }
  if (
    s.includes('earbud') ||
    s.includes('airpod') ||
    s.includes('audio') ||
    s.includes('sound') ||
    s.includes('speaker') ||
    s.includes('tws')
  ) {
    return '/categories/earbuds.png';
  }

  // Cameras, Drones & Imaging
  if (s.includes('drone')) return '/categories/drone.png';
  if (s.includes('gimbal')) return '/categories/gimbal.png';
  if (s.includes('action-camera') || s.includes('actioncamera')) {
    return '/categories/action-camera.png';
  }
  if (
    s.includes('camera') ||
    s.includes('cctv') ||
    s.includes('hd-camera') ||
    s.includes('webcam')
  ) {
    return '/categories/hd-camera.png';
  }

  // Power, Charging & Accessories
  if (s.includes('power-bank') || s.includes('powerbank')) {
    return '/categories/power-bank.png';
  }
  if (
    s.includes('power-supply') ||
    s.includes('psu') ||
    s.includes('charger') ||
    s.includes('adapter')
  ) {
    return '/categories/power-supply.png';
  }
  if (
    s.includes('cable') ||
    s.includes('hub') ||
    s.includes('case') ||
    s.includes('protect') ||
    s.includes('accessor')
  ) {
    return '/categories/mobile-accessories.png';
  }

  // PC Components & Hardware
  if (s.includes('laptop') || s.includes('notebook'))
    return '/categories/laptop.png';
  if (
    s.includes('desktop') ||
    s.includes('pc') ||
    s.includes('imac') ||
    s.includes('computer')
  ) {
    return '/categories/laptop.png';
  }
  if (s.includes('monitor') || s.includes('display'))
    return '/categories/monitor.png';
  if (s.includes('gpu') || s.includes('graphic')) return '/categories/gpu.png';
  if (s.includes('cpu') || s.includes('processor'))
    return '/categories/cpu.png';
  if (s.includes('motherboard') || s.includes('mainboard'))
    return '/categories/motherboard.png';
  if (s.includes('ram') || s.includes('memory')) return '/categories/ram.png';
  if (s.includes('ssd') || s.includes('storage') || s.includes('hard-drive'))
    return '/categories/ssd.png';
  if (
    s.includes('router') ||
    s.includes('wifi') ||
    s.includes('wi-fi') ||
    s.includes('network')
  ) {
    return '/categories/router.png';
  }

  // Smart Appliances
  if (s.includes('fryer')) return '/categories/air-fryer.png';
  if (s.includes('cooker') || s.includes('induction'))
    return '/categories/electric-cooker.png';

  // Fallback by icon string if present
  if (icon) {
    const iconKey = icon.toLowerCase();
    if (iconKey.includes('laptop')) return '/categories/laptop.png';
    if (iconKey.includes('smartphone') || iconKey.includes('phone'))
      return '/categories/iphone.png';
    if (iconKey.includes('watch')) return '/categories/smart-watch.png';
    if (iconKey.includes('headphones')) return '/categories/headphone.png';
    if (iconKey.includes('camera')) return '/categories/hd-camera.png';
    if (iconKey.includes('zap')) return '/categories/power-bank.png';
  }

  return null;
}
