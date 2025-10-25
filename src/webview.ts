import { Webview } from "@webview/webview";

const webview = new Webview();

webview.navigate(`http://localhost:3006/zh/chat`);
webview.run();
