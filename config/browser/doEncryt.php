<?php
class JoDES {
 
    private static $_instance = NULL;
    /**
     * @return JoDES
     */
    public static function share() {
        if (is_null(self::$_instance)) {
            self::$_instance = new JoDES();
        }
        return self::$_instance;
    }
 
    /**
     * 加密
     * @param string $str 要处理的字符串
     * @param string $key 加密Key，为8个字节长度
     * @return string
     */
    public function encode($str, $key) {
        $size = mcrypt_get_block_size(MCRYPT_DES, MCRYPT_MODE_CBC);
        $str = $this->pkcs5Pad($str, $size);
        $aaa = mcrypt_cbc(MCRYPT_DES, $key, $str, MCRYPT_ENCRYPT, $key);
        $ret = base64_encode($aaa);
        return $ret;
    }
 
    /**
     * 解密
     * @param string $str 要处理的字符串
     * @param string $key 解密Key，为8个字节长度
     * @return string
     */
    public function decode($str, $key) {
        $strBin = base64_decode($str);
        $str = mcrypt_cbc(MCRYPT_DES, $key, $strBin, MCRYPT_DECRYPT, $key);
        $str = $this->pkcs5Unpad($str);
        return $str;
    }
 
    function hex2bin($hexData) {
        $binData = "";
        for ($i = 0; $i < strlen($hexData); $i += 2) {
            $binData .= chr(hexdec(substr($hexData, $i, 2)));
        }
        return $binData;
    }
 
    function pkcs5Pad($text, $blocksize) {
        $pad = $blocksize - (strlen($text) % $blocksize);
        return $text . str_repeat(chr($pad), $pad);
    }
 
    function pkcs5Unpad($text) {
        $pad = ord($text {strlen($text) - 1});
        if ($pad > strlen($text))
            return false;
 
        if (strspn($text, chr($pad), strlen($text) - $pad) != $pad)
            return false;
 
        return substr($text, 0, - 1 * $pad);
    }
 
}
$encrypt = JoDES::share();
$srcFilePath = "plugin/plug.js";
$myfile = fopen($srcFilePath, "r") or die("Unable to open file!");
$str = fread($myfile,filesize($srcFilePath));
//echo $str;
//echo "1------------>";
//$str = "abcd123e陈超";
$str = $encrypt->encode($str,"ab123gad");
//echo $str;
//echo "2------------>";
//$str = $encrypt->decode($str,"ab123gad");
echo $str;
fclose($myfile);
$myfile = fopen("plugin/mydat.may", "w") or die("Unable to open file!");

fwrite($myfile, $str);

fclose($myfile);
?>

