<?php 
/* UserData.json(スコア情報)更新処理 */
if (!empty($_POST['name']) && !empty($_POST['text']) && !empty($_POST['time'])) {
    $name = $_POST['name'];
    $score = $_POST['text'];
    $time = $_POST['time'];
    $filename = './UserData.json';
    $data = [];
    $data["score"] = intval($score);
    $data["name"] = $name;
    $data["time"] = $time;
    if($file = file_get_contents($filename)){
            $file = str_replace(array(" ","\n","\r"),"",$file);
            $file = mb_substr($file,0,mb_strlen($file)-2);
            $json = json_encode($data);
            $json = $file.','.$json.']}';
            file_put_contents($filename,$json,LOCK_EX);
        }else{ // #2
            // ファイルがない場合 新規作成処理
            $json = json_encode($data);
            $json = '{"rank":[{"score":0,"name":"","time":0},'.$json.']}';
            file_put_contents($filename,$json,FILE_APPEND | LOCK_EX);

        }
}
 
?>