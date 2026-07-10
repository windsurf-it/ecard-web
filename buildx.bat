#!/bin/sh
cd "$(dirname "$0")"

IMAGE=rawinby/ecard-web
VERSION=${1:-latest}

# cleanup function เมื่อมี interrupt
cleanup() {
  echo ""
  echo "[!] Build interrupted!"
  echo "Cleaning up multi-builder..."
  docker buildx rm multi-builder 2>/dev/null || true
  exit 1
}

trap cleanup SIGINT SIGTERM

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Building Docker Image: $IMAGE:$VERSION"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# สร้าง builder สำหรับ multi-platform
docker buildx create --use --name multi-builder

# build multi-platform (amd64 + arm64) แล้ว push ไป Docker Hub ในคำสั่งเดียว
#  --platform linux/amd64,linux/arm64 \
docker buildx build \
  --platform linux/amd64 \
  --build-arg VERSION_NUMBER=$VERSION \
  -t $IMAGE:$VERSION \
  -f ./Dockerfile \
  --push \
  .

BUILD_STATUS=$?

# ลบ builder หลัง push เสร็จเพื่อเคลียร์ resource (ไม่ว่าสำเร็จหรือล้มเหลว)
echo ""
echo "Cleaning up multi-builder..."
docker buildx rm multi-builder 2>/dev/null || true

if [ $BUILD_STATUS -eq 0 ]; then
  echo "[OK] Build completed successfully!"
  echo "Image: $IMAGE:$VERSION"
else
  echo "[ERROR] Build failed!"
  exit 1
fi

# การใช้งาน:
# ./build.bat 1.0.2   #สั่ง Build และ Push image พร้อมระบุ version
# ./start.bat          #สั่ง Start Container



