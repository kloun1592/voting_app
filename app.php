<?php
    $redis = new Redis();
    $redis->connect('127.0.0.1');
    $voteName = "cakes";

    if (isset($_POST['action'])) 
    {
	    switch ($_POST['action']) 
	    {
	        case 'add_member':
	            add_member($voteName, $_POST['name'], $redis);
	            break;
	        case 'delete_member':
	            delete_member($voteName, $_POST['name'], $redis);
	            break;
	        case 'add_vote':
	            add_vote($_POST['name'], $redis);
	            break;
	        case 'delete_vote':
	            delete_vote($_POST['name'], $redis);
	            break;
	  	    case 'show_voting':
	            get_members($voteName, $redis);
	            break;
	    }
	}

	function create_vote($voteName, $redis, $memberName)
	{
		add_member($voteName, $memberName, $redis);
	}

	function add_member($voteName, $name, $redis)
	{
		//create set with member name
		$redis->sAdd($voteName, $name);

		//add to set string with key "memberName_counter"
		$redis->sAdd($name, $name . "_counter");

		//set to key "memberName_counter" value "1"
		$redis->set($name . "_counter", "1");
	}

	function delete_member($voteName, $name, $redis)
	{
		//delete key "memberName_counter"
		$redis->del($name . "_counter");

		//delete set  with member name
		$redis->sRem($voteName, $name);
	}

	function add_vote($memberName, $redis)
	{
		$redis->incr($memberName . "_counter");
		//increase key "memberName_counter"
	}

	function delete_vote($memberName, $redis)
	{	
		//decrease key "memberName_counter"
		if ($redis->get($memberName . "_counter") > 0)
		{
			$redis->decr($memberName . "_counter");
		}
		else
		{
			echo $memberName . "has 0 votes....";
		}
	}

	function get_members($voteName, $redis)
	{
		if (count($redis->sGetMembers($voteName)) > 0)
		{
			$membersArray = $redis->sGetMembers($voteName);
			$countersArray = array();
			for ($i=0; $i < count($membersArray); $i++) 
			{ 
				$countersArray[$i] = $redis->get($membersArray[$i] . "_counter");
			};

			$arr = array(
					"members" => $membersArray,
					"counters" => $countersArray
				);
			echo json_encode($arr);
		}
	}