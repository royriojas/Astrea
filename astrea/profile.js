/**
 * Profile Interceptor
 * Author: RRRM
 */
(function($) {
  $(function(){
    var profiles = {};
    window.console = window.console || {};
    var oldConsoleProfile = console.profile || function(){};
    var oldConsoleProfileEnd = console.profileEnd || function(){};
    var profileInterceptorEnabled = true;
    /**
     * if profile Interceptor is enabled save the time this function has been called
     * later that value will be used by profileEnd. 
     * 
     * IMPORTANT: A call to profile(profileName) must be followed by a call to profileEnd(profileName) 
     * in order to maintain the determistic nature of the calculations
     * 
     * @param {string} profileName
     */
    console.profile = function(profileName){
      profileName = (profileName && profileName != '')? $.trim(profileName) : "";
      if (profileInterceptorEnabled && profileName != "") {
        profiles[profileName] = profiles[profileName] ||
        {
          runs: []
        };
        var run = {
          timeStart: (new Date()).getTime()
        }
        profiles[profileName].runs.push(run);
      }
      oldConsoleProfile.apply(window.console, arguments);
    };
    /**
     * if profile Interceptor is enabled get the time before the first call
     *  to profile(profileName) and calculate the duration of the execution 
     *  and store it as a run
     * @param {string} profileName
     */
    console.profileEnd = function(profileName) {
      profileName = (profileName && profileName != '')? $.trim(profileName) : "";
      if (profileInterceptorEnabled && profileName != "") {
        var profile = profiles[profileName];
        if (!profile || profile.runs.length < 1) 
          return;
        var lastRun = profile.runs[profile.runs.length - 1];
        lastRun.timeEnd = (new Date()).getTime();
        lastRun.duration = lastRun.timeEnd - lastRun.timeStart;
        if (profile.max == null) {
          profile.max = lastRun.duration;
        }
        
        if (lastRun.duration > profile.max) { profile.max = lastRun.duration; }
        if (profile.min == null) {
          profile.min =  lastRun.duration;
        }
        if (lastRun.duration < profile.min) { profile.min = lastRun.duration; }
      }
      oldConsoleProfileEnd.apply(window.console, arguments);
    };
    /**
     * clear all the results from this particular profile group of runs
     * @param {string} profileName
     */
    console.profileClear = function(profileName) {
      profileName = (profileName && profileName != '')? $.trim(profileName) : "";
      if (profileInterceptorEnabled && profileName != "") {
        profiles[profileName] = { runs : [] };
      }
    };
    
    /**
     * clear all results
     */
    console.profileClearAll = function() {
      profiles = {};
    };
    /**
     * return the results for a particular profile group of calls identified by the profileName
     * If noLog is true, then the results are not logged using console.log
     * @param {string} profileName
     * @param {boolean} noLog
     */
    console.profileResult = function(profileName, noLog) {
      profileName = (profileName && profileName != '')? $.trim(profileName) : "";
      if (profileInterceptorEnabled && profileName != "") {
        var result = {
          averageTime: 0,
          min : 0,
          max : 0
        };
        var profile = profiles[profileName];
        if (!profile || !profile.runs || profile.runs.length < 1) 
          return;
        var avg = 0;
        var runs = profile.runs;
        var length = profile.runs.length;
        for (var i = 0; i < length; i++) {
          avg += runs[i].duration;
        }
        
        result.averageTime = avg / length;
        result.runs = runs;
        result.max = profile.max;
        result.min = profile.min;
        if (!noLog) 
          console.log(profileName + 'Results for ' + profileName, result);
        
        return result;
      }
    };
    /**
     * return the results for every profile found
     */
    console.profileResultsAll = function(log) {
      if (profileInterceptorEnabled) {
        var results = [];
        for (var profileName in profiles) {
          var result = console.profileResult(profileName, true);
          if (result) {
            result.profileName = profileName;
            results.push(result);
          }
        }
        
        if (log) {
          console.log('All Profiles : ', results);
        }
        return results;
      }
    };
    /**
     * Enable the profileInterceptor
     */
    console.enableProfileInterceptor = function() {
      profileInterceptorEnabled = true;
    };
    /**
     * Disable the profileInterceptor
     */
    console.disableProfileInterceptor = function() {
      profileInterceptorEnabled = false;
      console.profileClearAll();
    };
  })
})(jQuery);
