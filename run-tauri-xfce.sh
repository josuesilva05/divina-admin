#!/bin/bash

# Script para executar Tauri sem conflitos de biblioteca snap
# Completamente isola as bibliotecas snap

# EXECUTE ISSO APENAS SE SEU AMBIENTE DE DESENVOLVIMENTO FOR XFCE

# Limpa todas as variáveis de ambiente problemáticas
unset LD_PRELOAD
unset LD_LIBRARY_PATH
unset SNAP
unset SNAP_COMMON
unset SNAP_DATA
unset SNAP_USER_COMMON
unset SNAP_USER_DATA

# Remove completamente os diretórios snap do PATH
export PATH=$(echo $PATH | tr ':' '\n' | grep -v "/snap" | tr '\n' ':' | sed 's/:*$//')

# Força bibliotecas do sistema na ordem correta
export LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu:/usr/lib:/lib"

# Previne carregamento de bibliotecas snap
export LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libpthread.so.0"

# Execute o comando Tauri em um ambiente limpo
exec env -i \
  HOME="$HOME" \
  USER="$USER" \
  PATH="/home/josue/.nvm/versions/node/v24.4.1/bin:/home/josue/.cargo/bin:/usr/local/bin:/usr/bin:/bin:/usr/local/sbin:/usr/sbin:/sbin" \
  LD_LIBRARY_PATH="/usr/lib/x86_64-linux-gnu:/lib/x86_64-linux-gnu:/usr/lib:/lib" \
  LD_PRELOAD="/usr/lib/x86_64-linux-gnu/libpthread.so.0" \
  DISPLAY="$DISPLAY" \
  WAYLAND_DISPLAY="$WAYLAND_DISPLAY" \
  XDG_RUNTIME_DIR="$XDG_RUNTIME_DIR" \
  XDG_SESSION_TYPE="$XDG_SESSION_TYPE" \
  pnpm run tauri dev
