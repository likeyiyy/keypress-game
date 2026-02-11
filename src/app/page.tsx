"use client";

import { useState, useEffect, useCallback, useRef } from "react";

export default function Home() {
  const [key, setKey] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const audioCache = useRef<Map<string, string>>(new Map());
  const lastPlayTime = useRef(0);

  // 预加载所有按键音频
  useEffect(() => {
    const keysToPreload = [
      ...["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
      ..."0123456789",
      "空格", "回车", "退出", "退格", "Tab", "Shift", "Control", "Alt",
      "大写锁定", "上", "下", "左", "右", "删除", "插入", "Home", "End",
    ];

    keysToPreload.forEach((key) => {
      const url = `/api/tts?text=${encodeURIComponent(key)}`;
      audioCache.current.set(key, url);
      const audio = new Audio(url);
      audio.preload = "auto";
    });
  }, []);

  const speak = useCallback((text: string) => {
    const now = Date.now();
    if (now - lastPlayTime.current < 100) return;
    lastPlayTime.current = now;

    let url = audioCache.current.get(text);
    if (!url) {
      url = `/api/tts?text=${encodeURIComponent(text)}`;
      audioCache.current.set(text, url);
    }

    const audio = new Audio(url);
    audio.play().catch(console.error);
  }, []);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      // 阻止所有功能键的默认行为
      if (e.key.startsWith("F") && /^F\d+$/.test(e.key)) {
        e.preventDefault();
      }

      // Ctrl+G 退出全屏
      if (e.key === "g" && e.ctrlKey) {
        e.preventDefault();
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
        return;
      }

      let displayKey = e.key;
      let speakText = e.key;

      const specialKeys: Record<string, { display: string; speak: string }> = {
        " ": { display: "Space", speak: "空格" },
        Enter: { display: "Enter", speak: "回车" },
        Escape: { display: "Esc", speak: "退出" },
        Backspace: { display: "Backspace", speak: "退格" },
        Tab: { display: "Tab", speak: "Tab" },
        Shift: { display: "Shift", speak: "Shift" },
        Control: { display: "Ctrl", speak: "Control" },
        Alt: { display: "Alt", speak: "Alt" },
        Meta: { display: "Meta", speak: "Meta" },
        CapsLock: { display: "CapsLock", speak: "大写锁定" },
        ArrowUp: { display: "↑", speak: "上" },
        ArrowDown: { display: "↓", speak: "下" },
        ArrowLeft: { display: "←", speak: "左" },
        ArrowRight: { display: "→", speak: "右" },
        Delete: { display: "Delete", speak: "删除" },
        Insert: { display: "Insert", speak: "插入" },
        Home: { display: "Home", speak: "行首" },
        End: { display: "End", speak: "行尾" },
        PageUp: { display: "PageUp", speak: "上页" },
        PageDown: { display: "PageDown", speak: "下页" },
        "`": { display: "`", speak: "反引号" },
        "~": { display: "~", speak: "波浪号" },
        "!": { display: "!", speak: "感叹号" },
        "@": { display: "@", speak: "艾特" },
        "#": { display: "#", speak: "井号" },
        $: { display: "$", speak: "美元" },
        "%": { display: "%", speak: "百分号" },
        "^": { display: "^", speak: "脱字符" },
        "&": { display: "&", speak: "和号" },
        "*": { display: "*", speak: "星号" },
        "(": { display: "(", speak: "左括号" },
        ")": { display: ")", speak: "右括号" },
        "-": { display: "-", speak: "减号" },
        _: { display: "_", speak: "下划线" },
        "=": { display: "=", speak: "等号" },
        "+": { display: "+", speak: "加号" },
        "[": { display: "[", speak: "左方括号" },
        "]": { display: "]", speak: "右方括号" },
        "{": { display: "{", speak: "左花括号" },
        "}": { display: "}", speak: "右花括号" },
        "\\": { display: "\\", speak: "反斜杠" },
        "|": { display: "|", speak: "竖线" },
        ";": { display: ";", speak: "分号" },
        ":": { display: ":", speak: "冒号" },
        "'": { display: "'", speak: "单引号" },
        '"': { display: '"', speak: "双引号" },
        ",": { display: ",", speak: "逗号" },
        ".": { display: ".", speak: "句号" },
        "/": { display: "/", speak: "斜杠" },
        "<": { display: "<", speak: "小于号" },
        ">": { display: ">", speak: "大于号" },
        "?": { display: "?", speak: "问号" },
        F1: { display: "F1", speak: "F一" },
        F2: { display: "F2", speak: "F二" },
        F3: { display: "F3", speak: "F三" },
        F4: { display: "F4", speak: "F四" },
        F5: { display: "F5", speak: "F五" },
        F6: { display: "F6", speak: "F六" },
        F7: { display: "F7", speak: "F七" },
        F8: { display: "F8", speak: "F八" },
        F9: { display: "F9", speak: "F九" },
        F10: { display: "F10", speak: "F十" },
        F11: { display: "F11", speak: "F十一" },
        F12: { display: "F12", speak: "F十二" },
      };

      const numMap: Record<string, string> = {
        "0": "零", "1": "一", "2": "二", "3": "三", "4": "四",
        "5": "五", "6": "六", "7": "七", "8": "八", "9": "九",
      };

      if (specialKeys[displayKey]) {
        displayKey = specialKeys[displayKey].display;
        speakText = specialKeys[displayKey].speak;
      } else if (numMap[displayKey]) {
        speakText = numMap[displayKey];
      }

      setKey(displayKey);
      speak(speakText);
    },
    [speak]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [handleKeyPress]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const enterFullscreen = () => {
    document.documentElement.requestFullscreen();
  };

  const exitFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800"
      onClick={!isFullscreen ? enterFullscreen : exitFullscreen}
    >
      {!isFullscreen ? (
        <div className="text-center">
          <div className="text-6xl mb-6">🎮</div>
          <p className="text-white text-2xl font-bold">按键游戏</p>
          <p className="text-purple-200 text-xl mt-2">点击屏幕开始</p>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center">
          {key ? (
            <div className="text-white text-[20rem] font-bold leading-none select-none drop-shadow-2xl animate-bounce">
              {key}
            </div>
          ) : (
            <p className="text-purple-200 text-3xl animate-pulse">按任意键...</p>
          )}
        </div>
      )}
    </div>
  );
}
