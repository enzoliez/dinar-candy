{ pkgs }: {
  deps = [
    pkgs.nodejs_18
    pkgs.pkg-config
    pkgs.cairo
    pkgs.pango
    pkgs.libjpeg
    pkgs.gtk3
    pkgs.libuuid
    pkgs.libpng
    pkgs.nodePackages.canvas
  ];
}
