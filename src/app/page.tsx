"use client";

import { useState, useEffect, useCallback, useRef } from "react";

// 预计算所有文本到文件名的映射
const TEXT_TO_FILENAME: Record<string, string> = {
  // 字母
  "A": "QQ", "B": "Qg", "C": "Qw", "D": "RA", "E": "RQ", "F": "Rg", "G": "Rw",
  "H": "SA", "I": "SQ", "J": "Sg", "K": "Sw", "L": "TA", "M": "TQ", "N": "Tg",
  "O": "Tw", "P": "UA", "Q": "UQ", "R": "Ug", "S": "Uw", "T": "VA", "U": "VQ",
  "V": "Vg", "W": "Vw", "X": "WA", "Y": "WQ", "Z": "Wg",
  // 数字
  "零": "6Zu2", "一": "5LiA", "二": "5LqM", "三": "5LiJ", "四": "5Zub",
  "五": "5LqU", "六": "5YWt", "七": "5LiD", "八": "5YWr", "九": "5Lmd",
  // 特殊键
  "空格": "56m65qC8", "回车": "5Zue6L2m", "退出": "6YCA5Ye6", "退格": "6YCA5qC8",
  "Tab": "VGFi", "Shift": "U2hpZnQ", "Control": "Q29udHJvbA", "Alt": "QWx0",
  "大写锁定": "5aSn5YaZ6ZSB5a6a", "上": "5LiK", "下": "5LiL", "左": "5bem",
  "右": "5Y_z", "删除": "5Yig6Zmk", "插入": "5o_S5YWl", "行首": "6KGM6aaW",
  "行尾": "6KGM5bC_", "上页": "5LiK6aG1", "下页": "5LiL6aG1",
  // 符号
  "反引号": "5Y_N5byV5Y_3", "波浪号": "5rOi5rWq5Y_3", "感叹号": "5oSf5Y_55Y_3",
  "艾特": "6Im_54m5", "井号": "5LqV5Y_3", "美元": "576O5YWD", "百分号": "55m_5YiG5Y_3",
  "脱字符": "6ISx5a2X56ym", "和号": "5ZKM5Y_3", "星号": "5pif5Y_3",
  "左括号": "5bem5ous5Y_3", "右括号": "5Y_z5ous5Y_3", "减号": "5YeP5Y_3",
  "下划线": "5LiL5YiS57q_", "等号": "562J5Y_3", "加号": "5Yqg5Y_3",
  "左方括号": "5bem5pa55ous5Y_3", "右方括号": "5Y_z5pa55ous5Y_3",
  "左花括号": "5bem6Iqx5ous5Y_3", "右花括号": "5Y_z6Iqx5ous5Y_3",
  "反斜杠": "5Y_N5pac5p2g", "竖线": "56uW57q_", "分号": "5YiG5Y_3",
  "冒号": "5YaS5Y_3", "单引号": "5Y2V5byV5Y_3", "双引号": "5Y_M5byV5Y_3",
  "逗号": "6YCX5Y_3", "句号": "5Y_l5Y_3", "斜杠": "5pac5p2g",
  "小于号": "5bCP5LqO5Y_3", "大于号": "5aSn5LqO5Y_3", "问号": "6Zeu5Y_3",
  // F键
  "F一": "RuS4gA", "F二": "RuS6jA", "F三": "RuS4iQ", "F四": "RuWbmw",
  "F五": "RuS6lA", "F六": "RuWFrQ", "F七": "RuS4gw", "F八": "RuWFqw",
  "F九": "RuS5nQ", "F十": "RuWNgQ", "F十一": "RuWNgeS4gA", "F十二": "RuWNgeS6jA",
};

export default function Home() {
  const [key, setKey] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const lastPlayTime = useRef(0);

  const speak = useCallback((text: string) => {
    const now = Date.now();
    if (now - lastPlayTime.current < 100) return;
    lastPlayTime.current = now;

    const filename = TEXT_TO_FILENAME[text];
    if (!filename) {
      console.log("No audio for:", text);
      return;
    }

    const url = `/audio/${filename}.mp3`;
    const audio = new Audio(url);
    audio.play().catch(console.error);
  }, []);

  const handleKeyPress = useCallback(
    (e: KeyboardEvent) => {
      if (e.key.startsWith("F") && /^F\d+$/.test(e.key)) {
        e.preventDefault();
      }

      if ((e.key === "g" && e.ctrlKey) || e.key === "Escape" || e.key === "Meta") {
        if (document.fullscreenElement) {
          document.exitFullscreen();
        }
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
        const mapping = specialKeys[displayKey];
        displayKey = mapping.display;
        speakText = mapping.speak;
      } else if (numMap[displayKey]) {
        speakText = numMap[displayKey];
      } else if (/^[a-zA-Z]$/.test(displayKey)) {
        speakText = displayKey.toUpperCase();
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

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800"
      onClick={!isFullscreen ? () => document.documentElement.requestFullscreen() : () => document.exitFullscreen()}
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
            <div className="text-white text-[28rem] font-bold leading-none select-none drop-shadow-2xl animate-bounce">
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
