/**
* Author: David Healey
* License: Public Domain
*/

namespace groupFXCurves
{
  inline function twoGroups(table)
  {
      table.reset(0);
      table.reset(1);

      //Group1
      table.setTablePoint(0, 0, 0.0, 1.0, 0.4);
      table.setTablePoint(0, 1, 1.0, 0.0, 0.4);

      //Group2
      table.setTablePoint(1, 0, 0.0, 0.0, 0.4);
      table.setTablePoint(1, 1, 1.0, 1.0, 0.6);
  }

  inline function twoGroupsS(table)
  {
      table.reset(0);
      table.reset(1);

      //Group1
      table.setTablePoint(0, 1, 0.0, 1.0, 1.0);
      table.addTablePoint(0, 0.5, 0.5);
      table.setTablePoint(0, 1, 0.5, 0.5, 0.4);
      table.setTablePoint(0, 2, 1.0, 0.0, 0.6);

      //Group2
      table.setTablePoint(1, 0, 0.0, 0.0, 0.6);
      table.addTablePoint(1, 0.5, 0.5);
      table.setTablePoint(1, 1, 0.5, 0.5, 0.4);
      table.setTablePoint(1, 2, 1.0, 1.0, 0.6);
  }


  inline function threeGroups(table)
  {
      table.reset(0);
      table.reset(1);
      table.reset(2);

      // Group1
      table.setTablePoint(0, 0, 0.0, 1.0, 0.4);
      table.addTablePoint(0, 0.5, 0.0);
      table.setTablePoint(0, 1, 0.5, 0.0, 0.4);
      table.setTablePoint(0, 2, 1.0, 0.0, 0.4);

      // Group2
      table.setTablePoint(1, 0, 0.0, 0.0, 0.6);
      table.addTablePoint(1, 0.5, 1.0);
      table.setTablePoint(1, 1, 0.5, 1.0, 0.6);
      table.setTablePoint(1, 2, 1.0, 0.0, 0.4);

      // Group3
      table.setTablePoint(2, 0, 0.0, 0.0, 0.4);
      table.addTablePoint(2, 0.5, 0.0);
      table.setTablePoint(2, 1, 0.5, 0.0, 0.4);
      table.setTablePoint(2, 2, 1.0, 1.0, 0.6);
  }

  inline function threeGroupsS(table)
  {
      table.reset(0);
      table.reset(1);
      table.reset(2);

      //Group1
      table.setTablePoint(0, 0, 0.0, 1.0, 1.0);
      table.addTablePoint(0, 0.25, 0.5);
      table.setTablePoint(0, 1, 0.25, 0.5, 0.4);
      table.addTablePoint(0, 0.5, 0.0);
      table.setTablePoint(0, 2, 0.5, 0.0, 0.6);
      table.setTablePoint(0, 3, 1.0, 0.0, 0.6);

      //Group2
      table.setTablePoint(1, 0, 0.0, 0.0, 1.0);
      table.addTablePoint(1, 0.25, 0.5);
      table.setTablePoint(1, 1, 0.25, 0.5, 0.4);
      table.addTablePoint(1, 0.5, 1.0);
      table.setTablePoint(1, 2, 0.5, 1.0, 0.6);
      table.addTablePoint(1, 0.75, 0.5);
      table.setTablePoint(1, 3, 0.75, 0.5, 0.4);
      table.setTablePoint(1, 4, 1.0, 0.0, 0.6);

      //Group3
      table.setTablePoint(2, 0, 0.0, 0.0, 1.0);
      table.addTablePoint(2, 0.5, 0.0);
      table.setTablePoint(2, 1, 0.5, 0, 0.6);
      table.addTablePoint(2, 0.75, 0.5);
      table.setTablePoint(2, 2, 0.75, 0.5, 0.4);
      table.setTablePoint(2, 3, 1.0, 1.0, 0.6);
  }

  inline function fourGroups(table)
  {
      table.reset(0);
      table.reset(1);
      table.reset(2);
      table.reset(3);

      // Group1
      table.setTablePoint(0, 0, 0.0, 1.0, 0.4);
      table.addTablePoint(0, 1, 1);
      table.setTablePoint(0, 1, 0.33, 0.0, 0.4);
      table.setTablePoint(0, 2, 1.0, 0.0, 0.4);

      //Group2
      table.setTablePoint(1, 0, 0.0, 0.0, 0.4);
      table.addTablePoint(1, 0.33, 1.0);
      table.setTablePoint(1, 1, 0.33, 1.0, 0.6);
      table.addTablePoint(1, 0.66, 0.0);
      table.setTablePoint(1, 2, 0.66, 0.0, 0.4);
      table.setTablePoint(1, 3, 1.0, 0.0, 0.4);

      //Group3
      table.setTablePoint(2, 0, 0.0, 0.0, 0.4);
      table.addTablePoint(2, 0.33, 0.0);
      table.setTablePoint(2, 1, 0.33, 0.0, 0.4);
      table.addTablePoint(2, 0.66, 1.0);
      table.setTablePoint(2, 2, 0.66, 1.0, 0.6);
      table.setTablePoint(2, 3, 1.0, 0.0, 0.4);

      //Group4
      table.setTablePoint(3, 0, 0.0, 0.0, 0.4);
      table.addTablePoint(3, 0.66, 0.0);
      table.setTablePoint(3, 1, 0.66, 0.0, 0.6);
      table.setTablePoint(3, 2, 1.0, 1.0, 0.6);
  }

  inline function fourGroupsS(table)
  {
      table.reset(0);
      table.reset(1);
      table.reset(2);
      table.reset(3);

      //Group1
      table.setTablePoint(0, 0, 0.0, 1.0, 1.0);
      table.addTablePoint(0, 0.16, 0.5);
      table.setTablePoint(0, 1, 0.16, 0.5, 0.4);
      table.addTablePoint(0, 0.33, 0.0);
      table.setTablePoint(0, 2, 0.33, 0.0, 0.6);
      table.setTablePoint(0, 3, 1.0, 0.0, 0.0);

      //Group2
      table.setTablePoint(1, 0, 1.0, 0.0, 1.0);
      table.addTablePoint(1, 0.16, 0.5);
      table.setTablePoint(1, 1, 0.16, 0.5, 0.4);
      table.addTablePoint(1, 0.33, 1.0);
      table.setTablePoint(1, 2, 0.33, 1.0, 0.6);
      table.addTablePoint(1, 0.5, 0.5);
      table.setTablePoint(1, 3, 0.5, 0.5, 0.4);
      table.addTablePoint(1, 0.65, 0.0);
      table.setTablePoint(1, 4, 0.65, 0.0, 0.6);
      table.setTablePoint(1, 5, 1.0, 0.0, 0.4);

      //Group3
      table.setTablePoint(2, 0, 0.0, 0.0, 1.0);
      table.addTablePoint(2, 0.33, 0.0);
      table.setTablePoint(2, 1, 0.33, 0.0, 0.4);
      table.addTablePoint(2, 0.5, 0.5);
      table.setTablePoint(2, 2, 0.5, 0.5, 0.4);
      table.addTablePoint(2, 0.66, 1.0);
      table.setTablePoint(2, 3, 0.66, 1.0, 0.6);
      table.addTablePoint(2, 0.83, 0.5);
      table.setTablePoint(2, 4, 0.83, 0.5, 0.4);
      table.setTablePoint(2, 5, 1.0, 0.0, 0.6);

      //Group4
      table.setTablePoint(3, 0, 0.0, 0.0, 1.0);
      table.addTablePoint(3, 0.66, 0.0);
      table.setTablePoint(3, 1, 0.66, 0.0, 0.6);
      table.addTablePoint(3, 0.83, 0.5);
      table.setTablePoint(3, 2, 0.83, 0.5, 0.4);
      table.setTablePoint(3, 3, 1.0, 1.0, 0.6);
  }
}
