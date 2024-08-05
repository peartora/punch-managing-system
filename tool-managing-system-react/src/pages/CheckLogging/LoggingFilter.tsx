import { useState, useEffect } from "react";

import { getUserList } from "@/common/actions/logging/getUserList";
import { getActivityList } from "@/common/actions/logging/getActivityList";

export function LoggingFilter() {
  const [username, setUsername] = useState("");
  const [activity, setActivity] = useState("");

  let userList: string[];
  let activityList: string[];

  useEffect(() => {
    try {
      userList = await getUserList();
    } catch (error) {
      alert(error.message);
      return;
    }
  });

  useEffect(() => {
    try {
      activityList = await getActivityList();
    } catch (error) {
      alert(error.message);
      return;
    }
  });

  return (
    <div>
      <form>
        <label htmlFor="username">Username</label>
        <select onChange={(e) => setUsername(e.target.value)}>
          {userList && userList.length > 0 ? (
            userList.map((user) => (
              <option key={user} value={user}>
                {user}
              </option>
            ))
          ) : (
            <option disabled>선택할 user가 없습니다.</option>
          )}
        </select>
        <label htmlFor="activity">Activity</label>
        <select onChange={(e) => setActivity(e.target.value)}>
          {activityList.map((activity) => (
            <option key={activity}>{activity}</option>
          ))}
        </select>
      </form>
    </div>
  );
}
