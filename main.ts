pins.onPulsed(DigitalPin.P0, PulseValue.High, function () {
    if (受信管理 == 1) {
        パルス幅データ.push(pins.pulseDuration())
        if (pins.pulseDuration() > 20000) {
            受信管理 = 2
            basic.showIcon(IconNames.Happy)
            BT送信()
        }
    }
})
function BT送信 () {
    if (0 < パルス幅データ.length) {
        basic.showArrow(ArrowNames.North)
        for (let 送信カウンター = 0; 送信カウンター <= パルス幅データ.length; 送信カウンター++) {
            bluetooth.uartWriteNumber(パルス幅データ[送信カウンター])
            basic.pause(20)
        }
        basic.showIcon(IconNames.Happy)
    } else {
        basic.showIcon(IconNames.Asleep)
    }
    basic.clearScreen()
}
// IR送信テスト
// 
// 搬送波
// 
// ループ回数10＝25us、40KHz
// 
// ループ回数12＝28us、36KH
function モード設定 (数値: number) {
    if (数値 == 1) {
        周波数2長 = 7
        ヘッダー1長 = 270
        ヘッダー2長 = 129
        _1T = 15
        _3T = 46
    } else if (数値 == 2) {
        周波数2長 = 7
        ヘッダー1長 = 135
        ヘッダー2長 = 65
        _1T = 15
        _3T = 46
    } else {
        IRデータ数 = IRデータ数 - 1
        周波数1長 = 5
        周波数2長 = 4
        ヘッダー1長 = 98
        ヘッダー2長 = 26
        _1T = 23
        _3T = 40
    }
}
bluetooth.onBluetoothConnected(function () {
    basic.showIcon(IconNames.Yes)
    接続中 = 1
})
bluetooth.onBluetoothDisconnected(function () {
    basic.showIcon(IconNames.No)
    接続中 = 0
})
input.onButtonPressed(Button.A, function () {
    if (受信管理 == 2) {
        basic.showArrow(ArrowNames.South)
        パルス幅データ = []
        受信管理 = 0
    } else if (受信管理 == 0) {
        basic.clearScreen()
        受信管理 = 2
    }
})
bluetooth.onUartDataReceived(serial.delimiters(Delimiters.Fullstop), function () {
    受信データ = bluetooth.uartReadUntil(serial.delimiters(Delimiters.Fullstop))
    if (受信データ.length > 6) {
        IRモード = parseFloat(受信データ.charAt(0))
        IRデータ数 = parseFloat(受信データ.substr(1, 2))
        パルスくり返し回数 = parseFloat(受信データ.charAt(3))
        パルス間空き時間 = parseFloat(受信データ.substr(4, 2))
        IRデータ = []
        for (let カウンター = 0; カウンター <= 受信データ.length - 6; カウンター++) {
            IRデータ.push(受信データ.charAt(カウンター + 6))
        }
        モード設定(IRモード)
        basic.showIcon(IconNames.Happy)
        basic.clearScreen()
        control.raiseEvent(
        EventBusSource.MICROBIT_ID_BUTTON_B,
        EventBusValue.MICROBIT_BUTTON_EVT_CLICK
        )
    }
})
pins.onPulsed(DigitalPin.P0, PulseValue.Low, function () {
    if (受信管理 <= 1) {
        パルス幅データ.push(pins.pulseDuration())
        if (受信管理 == 1) {
            if (pins.pulseDuration() > 20000) {
                受信管理 = 2
                basic.showIcon(IconNames.Happy)
                BT送信()
            }
        } else if (受信管理 == 0) {
            受信管理 = 1
        }
        最後の受信時間 = control.millis()
    }
})
input.onButtonPressed(Button.B, function () {
    basic.showArrow(ArrowNames.North)
    送信データ作成()
    for (let index = 0; index < パルスくり返し回数; index++) {
        for (let index = 0; index < ヘッダー1長; index++) {
            pins.digitalWritePin(DigitalPin.P14, LEDオン)
            for (let index = 0; index < 周波数1長; index++) {
                値 = pins.digitalReadPin(DigitalPin.P0)
            }
            pins.digitalWritePin(DigitalPin.P14, LEDオフ)
            for (let index = 0; index < 周波数2長; index++) {
                値 = pins.digitalReadPin(DigitalPin.P0)
            }
        }
        for (let index = 0; index < ヘッダー2長; index++) {
            pins.digitalWritePin(DigitalPin.P14, 0)
            for (let index = 0; index < 周波数1長; index++) {
                値 = pins.digitalReadPin(DigitalPin.P0)
            }
            pins.digitalWritePin(DigitalPin.P14, 0)
            for (let index = 0; index < 周波数2長; index++) {
                値 = pins.digitalReadPin(DigitalPin.P0)
            }
        }
        if (IRモード <= 2) {
            for (let カウンター2 = 0; カウンター2 <= IRデータ数; カウンター2++) {
                for (let index = 0; index < _1T; index++) {
                    pins.digitalWritePin(DigitalPin.P14, LEDオン)
                    for (let index = 0; index < 周波数1長; index++) {
                        値 = pins.digitalReadPin(DigitalPin.P0)
                    }
                    pins.digitalWritePin(DigitalPin.P14, LEDオフ)
                    for (let index = 0; index < 周波数2長; index++) {
                        値 = pins.digitalReadPin(DigitalPin.P0)
                    }
                }
                for (let index = 0; index < 送信データ[カウンター2]; index++) {
                    pins.digitalWritePin(DigitalPin.P14, 0)
                    for (let index = 0; index < 周波数1長; index++) {
                        値 = pins.digitalReadPin(DigitalPin.P0)
                    }
                    pins.digitalWritePin(DigitalPin.P14, 0)
                    for (let index = 0; index < 周波数2長; index++) {
                        値 = pins.digitalReadPin(DigitalPin.P0)
                    }
                }
            }
        } else {
            for (let カウンター3 = 0; カウンター3 <= IRデータ数; カウンター3++) {
                for (let index = 0; index < 送信データ[カウンター3]; index++) {
                    pins.digitalWritePin(DigitalPin.P14, LEDオン)
                    for (let index = 0; index < 周波数1長; index++) {
                        値 = pins.digitalReadPin(DigitalPin.P0)
                    }
                    pins.digitalWritePin(DigitalPin.P14, LEDオフ)
                    for (let index = 0; index < 周波数2長; index++) {
                        値 = pins.digitalReadPin(DigitalPin.P0)
                    }
                }
                for (let index = 0; index < _1T; index++) {
                    pins.digitalWritePin(DigitalPin.P14, 0)
                    for (let index = 0; index < 周波数1長; index++) {
                        値 = pins.digitalReadPin(DigitalPin.P0)
                    }
                    pins.digitalWritePin(DigitalPin.P14, 0)
                    for (let index = 0; index < 周波数2長; index++) {
                        値 = pins.digitalReadPin(DigitalPin.P0)
                    }
                }
            }
        }
        basic.pause(パルス間空き時間)
    }
    if (接続中 != 0) {
        basic.showIcon(IconNames.Yes)
    } else {
        basic.clearScreen()
    }
})
function 送信データ作成 () {
    送信データ = []
    for (let カウンター4 = 0; カウンター4 <= IRデータ.length; カウンター4++) {
        if (IRデータ[カウンター4] == "F") {
            値 = 15
        } else if (IRデータ[カウンター4] == "E") {
            値 = 14
        } else if (IRデータ[カウンター4] == "D") {
            値 = 13
        } else if (IRデータ[カウンター4] == "C") {
            値 = 12
        } else if (IRデータ[カウンター4] == "B") {
            値 = 11
        } else if (IRデータ[カウンター4] == "A") {
            値 = 10
        } else if (IRデータ[カウンター4] == "9") {
            値 = 9
        } else if (IRデータ[カウンター4] == "8") {
            値 = 8
        } else if (IRデータ[カウンター4] == "7") {
            値 = 7
        } else if (IRデータ[カウンター4] == "6") {
            値 = 6
        } else if (IRデータ[カウンター4] == "5") {
            値 = 5
        } else if (IRデータ[カウンター4] == "4") {
            値 = 4
        } else if (IRデータ[カウンター4] == "3") {
            値 = 3
        } else if (IRデータ[カウンター4] == "2") {
            値 = 2
        } else if (IRデータ[カウンター4] == "1") {
            値 = 1
        } else {
            値 = 0
        }
        if (値 >= 8) {
            送信データ.push(_3T)
            値 = 値 - 8
        } else {
            送信データ.push(_1T)
        }
        if (値 >= 4) {
            送信データ.push(_3T)
            値 = 値 - 4
        } else {
            送信データ.push(_1T)
        }
        if (値 >= 2) {
            送信データ.push(_3T)
            値 = 値 - 2
        } else {
            送信データ.push(_1T)
        }
        if (値 >= 1) {
            送信データ.push(_3T)
        } else {
            送信データ.push(_1T)
        }
    }
}
let 受信データ = ""
let 周波数1長 = 0
let _3T = 0
let _1T = 0
let ヘッダー2長 = 0
let ヘッダー1長 = 0
let 周波数2長 = 0
let 最後の受信時間 = 0
let 受信管理 = 0
let パルス幅データ: number[] = []
let パルス間空き時間 = 0
let パルスくり返し回数 = 0
let IRモード = 0
let 送信データ: number[] = []
let IRデータ数 = 0
let IRデータ: string[] = []
let 値 = 0
let LEDオフ = 0
let LEDオン = 0
let 接続中 = 0
basic.showIcon(IconNames.Square)
接続中 = 0
LEDオン = 1
LEDオフ = 0
値 = 0
pins.digitalWritePin(DigitalPin.P14, 0)
IRデータ = []
IRデータ数 = 20
送信データ = []
IRモード = 3
パルスくり返し回数 = 5
パルス間空き時間 = 20
モード設定(IRモード)
let IR入力 = pins.digitalReadPin(DigitalPin.P0)
パルス幅データ = []
受信管理 = 2
最後の受信時間 = control.millis()
basic.forever(function () {
    if (受信管理 == 1) {
        if (control.millis() - 最後の受信時間 > 45) {
            受信管理 = 2
            basic.showIcon(IconNames.Surprised)
            BT送信()
        }
    }
})
