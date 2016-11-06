# LWOT Platform - Ionic

## Install

### Install Dependencies

```bash
npm install -g cordova ionic
```

### Install Platform

```bash
lwot install https://github.com/searble/lwot-platform-ionic.git
lwot install platform ionic #not working yet
```

### Run

```bash
lwot build ionic
# deploy auto remove platform and then add platform
lwot ionic deploy ios #ionic platfrom  add ios
lwot ionic deploy android #ionic platfrom  add android
lwot ionic run  #ionic serve --lab
lwot ionic run ios #ionic run ios
lwot ionic run android #ionic run android
```